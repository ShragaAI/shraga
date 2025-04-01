import json
import os
from collections import namedtuple
from datetime import datetime
from typing import List, Optional, Union

import boto3
import geopandas as gpd
import googlemaps
import pandas as pd
import requests
from botocore.exceptions import ClientError
from shapely.geometry import Point, Polygon
from tqdm.auto import tqdm

from shraga_common import ShragaConfig


class GoogleMapsRetriever:
    gmaps = None
    Place = None
    gdf_data = None

    def __init__(
        self,
        shraga_config: ShragaConfig,
        fn_cities_and_urban_areas: str,
        retriever_name: Optional[str] = None,
    ):
        self.fn_cities_and_urban_areas = fn_cities_and_urban_areas
        self.config = shraga_config
        self.api_key = shraga_config.get("services.googlemaps.api_key")
        self.gmaps = googlemaps.Client(key=self.api_key)
        self.Place = namedtuple("Place", ["name", "type", "lat", "lon"])
        self.initGdf()

    def initGdf(self):
        aws_region = self.config.get("aws.region") or "us-east-1"
        aws_bucket = self.config.get("aws.assets_bucket")
        if not os.path.exists(self.fn_cities_and_urban_areas) and aws_bucket:
            try:
                s3 = boto3.resource("s3", region_name=aws_region)
                s3.Bucket(aws_bucket).download_file(
                    "cities_and_urban_areas.geojson", self.fn_cities_and_urban_areas
                )
            except ClientError as e:
                raise FileNotFoundError(
                    f"File not found: {self.fn_cities_and_urban_areas}. Asset download failed with "
                    + str(e.response["Error"]["Code"])
                )
            except Exception as e:
                raise FileNotFoundError(
                    f"File not found: {self.fn_cities_and_urban_areas}. Asset download failed with "
                    + str(e)
                )

        if not os.path.exists(self.fn_cities_and_urban_areas):
            raise FileNotFoundError(f"File not found: {self.fn_cities_and_urban_areas}")

        self.gdf_data = gpd.read_file(self.fn_cities_and_urban_areas)

    # Google Maps API utilities
    def get_location_by_name(self, name: str) -> Optional[dict]:
        "Given a location name, return the geocoded location."

        geocode_result = self.gmaps.geocode(name)
        return geocode_result[0] if geocode_result else None

    def get_fastest_route(self, origin, destination):
        """
        Get the fastest route between two points
        """
        # Get the current time for real-time traffic estimation
        now = datetime.now()

        # Get directions with real-time traffic consideration
        directions_result = self.gmaps.directions(
            origin=origin,
            destination=destination,
            mode="driving",
            departure_time=now,
            traffic_model="best_guess",  # Estimate based on real-time traffic conditions
        )

        # Check if a route was found
        if not directions_result:
            return None

        # Extract and display relevant information
        for route in directions_result:
            leg = route["legs"][0]
            route_info = {
                "start": leg["start_address"],
                "end": leg["end_address"],
                "distance": leg["distance"]["text"],
                "duration_without_traffic": leg["duration"]["text"],
                "duration_with_traffic": leg["duration_in_traffic"]["text"],
                "steps": [step["html_instructions"] for step in leg["steps"]],
            }
            return route_info

    def get_routes_between_locations(
        self, loc_a: str, loc_b: str, n_routes: int
    ) -> List[dict]:
        "Given two locations (as strings), return the routes between them."
        directions_result = self.gmaps.directions(loc_a, loc_b, alternatives=True, units="metric")
        return directions_result[:n_routes]

    def get_locations_along_route(
        self,
        loc_a: str,
        loc_b: str,
        n_routes: int = 2,
        radius_km: float = 2.0,
        location_types: Union[None, list, set, str] = "selected",
        step_fraction: float = 1.0,
    ) -> List[Place]:
        """
        Given two locations, return the places along the routes between them.

        The function first retrieves the routes between the two locations using the `get_routes_between_locations` function.
        It then iterates over the routes and extracts the steps along each route. For each step, the function retrieves the
        places nearby using the Google Places API. The function filters the places based on the specified location types and
        radius. The function returns a list of named tuples representing the places along the routes.

        Args:
            loc_a (str): The starting location.
            loc_b (str): The destination location.
            n_routes (int): The number of alternative routes to retrieve.
            radius_km (float, optional): The radius in kilometers to search for places around each point. Defaults to 2.0.
            location_types (Union[None, list, set, str], optional): Types of locations to search for.
                Use "selected" for default types,
                None for all types, or provide a list/set of specific types. Defaults to "selected".
            step_fraction (float, optional): Fraction of steps to consider along the route (0.0 to 1.0). Defaults to 1.0.

        Returns:
            List[Place]: A list of named tuples representing the places along the routes.


        """
        if location_types == "selected":
            location_types = {"locality"}  # , "route", "intersection"}
        elif isinstance(location_types, str):
            location_types = location_types.split(",")
        if location_types is None:
            location_types = [None]

        routes = self.get_routes_between_locations(loc_a, loc_b, n_routes)
        places_along_routes = []

        for route in tqdm(routes, desc="Processing routes"):
            path = []
            for leg in tqdm(route["legs"], desc="Processing route legs"):
                steps = leg["steps"]
                num_steps = max(1, int(len(steps) * step_fraction))
                for step in steps[:num_steps]:
                    lat_lng = step["end_location"]
                    path.append((lat_lng["lat"], lat_lng["lng"]))

            for point in tqdm(path, desc="Processing points along route"):
                for location_type in location_types:
                    places_results = self.gmaps.places_nearby(
                        location=point,
                        radius=radius_km * 1_000,
                        type=location_type,
                        language="en",
                    )
                    if places_results["results"]:
                        for pr in places_results["results"]:
                            curr = self.Place(
                                name=pr["name"],
                                type=",".join(pr["types"]),
                                lat=pr["geometry"]["location"]["lat"],
                                lon=pr["geometry"]["location"]["lng"],
                            )
                            if curr not in places_along_routes:
                                places_along_routes.append(curr)
        return places_along_routes

    def get_places_near_location(
        self,
        location: Union[str, dict],
        radius_km: float = 2.0,
        location_types: Union[None, list, set, str] = "selected",
        limit=20,
    ) -> List[Place]:
        if radius_km > 50:
            raise ValueError(
                "The maximum radius allowed by the Google Places API is 50 km."
            )
        if limit > 20:
            raise ValueError(
                "The maximum number of results allowed by the Google Places API is 20."
            )

        if location_types == "selected":
            location_types = ["locality"]  # , "route", "intersection"]
        elif isinstance(location_types, str):
            location_types = location_types.split(",")
        if location_types is None:
            location_types = [None]

        if isinstance(location, str):
            loc = self.get_location_by_name(location)
            if not loc:
                return []
            lat, lon = (
                loc["geometry"]["location"]["lat"],
                loc["geometry"]["location"]["lng"],
            )
        elif isinstance(location, dict):
            lat, lon = location["lat"], location["lon"]
        else:
            raise ValueError(
                "The location should be a string or a dictionary with 'lat' and 'lon' keys."
            )

        places = []

        for location_type in location_types:
            endpoint = "https://places.googleapis.com/v1/places:searchNearby"
            body = {
                "includedTypes": [location_type],
                "maxResultCount": limit,
                "locationRestriction": {
                    "circle": {
                        "center": {"latitude": lat, "longitude": lon},
                        "radius": radius_km * 1000,
                    }
                },
            }
            headers = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": self.api_key,
                "X-Goog-FieldMask": "places.displayName,places.location,places.types",
            }
            response = requests.post(endpoint, headers=headers, data=json.dumps(body))
            places_results = response.json()

            if "places" in places_results:
                for pr in places_results["places"]:
                    curr = self.Place(
                        name=pr["displayName"]["text"],
                        type=",".join(pr["types"]),
                        lat=pr["location"]["latitude"],
                        lon=pr["location"]["longitude"],
                    )
                    if curr not in places:
                        places.append(curr)
        return places

    def generate_locations_from_a_country(
        self,
        country_code,
        limit=10,
    ) -> list:
        assert (
            len(country_code) == 2
        ), f"Country code must be a two-letter code. You provided: {country_code}"
        country_code = country_code.upper()

        gdf = pd.DataFrame(
            self.gdf_data[self.gdf_data["country code"] == country_code]
            .sort_values("population", ascending=False)
            .head(limit)
        )

        places = []
        for _, row in gdf.iterrows():
            geometry = row["geometry"] if "geometry" in row else ""
            if geometry.geom_type == "Point":
                centroid = (geometry.y, geometry.x)
            elif geometry.geom_type == "Polygon":
                centroid = gpd.GeoSeries(geometry).centroid
            else:
                raise Exception(f"Unknown geometry type {geometry.geom_type}")
            places.append(
                self.Place(
                    name=row["name"],
                    type="locality",
                    lat=centroid[0],
                    lon=centroid[1],
                )
            )

        return places

    def is_within_distance_of_point(
        self, polygons_gdf: gpd.GeoSeries, point_lon_lat: Point, distance_km: float
    ):
        distance_m = distance_km * 1000
        point_gdf = gpd.GeoDataFrame(
            index=[0], crs="EPSG:4326", geometry=[point_lon_lat]
        )
        polygons_gdf = polygons_gdf.set_crs("EPSG:4326").to_crs(epsg=3857)
        point_gdf = point_gdf.to_crs(epsg=3857)
        point_buffer = point_gdf.buffer(distance_m).iloc[0]
        return polygons_gdf.intersects(point_buffer)

    def is_within_distance_of_polygon(
        self, polygons_gdf: gpd.GeoSeries, polygon_lon_lat: Polygon, distance_km: float
    ):
        distance_m = distance_km * 1000
        polygon_gdf = gpd.GeoDataFrame(
            index=[0], crs="EPSG:4326", geometry=[polygon_lon_lat]
        )
        polygons_gdf = polygons_gdf.set_crs("EPSG:4326").to_crs(epsg=3857)
        polygon_gdf = polygon_gdf.to_crs(epsg=3857)
        polygon_buffer = polygon_gdf.buffer(distance_m).iloc[0]
        return polygons_gdf.intersects(polygon_buffer)

    def distance_between(
        self,
        a_lon_lat: Union[Point, Polygon, tuple],
        b_lon_lat: Union[Point, Polygon, tuple],
    ) -> float:
        if isinstance(a_lon_lat, tuple):
            a_lon_lat = Point(a_lon_lat[1], a_lon_lat[0])
        if isinstance(b_lon_lat, tuple):
            b_lon_lat = Point(b_lon_lat[1], b_lon_lat[0])

        gdf_a = gpd.GeoDataFrame(
            index=[0], crs="EPSG:4326", geometry=[a_lon_lat]
        ).to_crs(epsg=3857)
        gdf_b = gpd.GeoDataFrame(
            index=[0], crs="EPSG:4326", geometry=[b_lon_lat]
        ).to_crs(epsg=3857)
        distance_m = gdf_a.distance(gdf_b).iloc[0]
        return distance_m / 1000

    def find_interesting_locations(
        self,
        city_a: str,
        city_b: Optional[str] = None,
        n_routes: int = 2,
        radius_km: float = 10.0,
        location_types: str = "selected",
        step_fraction: float = 1.0,
        output_file: Optional[str] = None,
        verbose: bool = True,
    ) -> None:
        if city_b:
            result = self.get_locations_along_route(
                city_a, city_b, n_routes, radius_km, location_types, step_fraction
            )
        else:
            result = self.get_places_near_location(city_a, radius_km, location_types)
        result = pd.DataFrame(result)
        if verbose:
            print(f"The places found are:\n{result.to_markdown()}")
        if output_file:
            result.to_csv(output_file, index=False)
            if verbose:
                print(f"Results saved to {output_file}")

    def demonstrate(
        self,
        *,
        city_a: str,
        city_b: str = None,
        n_routes: int = 2,
        radius_km: float = 10.0,
        location_types: str = "selected",
        step_fraction: float = 1.0,
        output_file: str = None,
        verbose: bool = False,
    ) -> None:
        """
        Find interesting locations along routes or around a city using Google Maps API.

        Args:
            city_a (str): Name of the first city (required).
            city_b (str, optional): Name of the second city. Defaults to None.
            n_routes (int, optional): Number of alternative routes to consider. Defaults to 2.
            radius_km (float, optional): Radius in kilometers to search for places. Defaults to 10.0.
            location_types (str, optional): Types of locations to search for. Defaults to "selected".
            step_fraction (float, optional): Fraction of steps to consider along the route. Defaults to 1.0.
            output_file (str, optional): Path to save the output to a file. Defaults to None.
            verbose (bool, optional): Print verbose output. Defaults to False.
        """
        self.find_interesting_locations(
            city_a=city_a,
            city_b=city_b,
            n_routes=n_routes,
            radius_km=radius_km,
            location_types=location_types,
            step_fraction=step_fraction,
            output_file=output_file,
            verbose=verbose,
        )
