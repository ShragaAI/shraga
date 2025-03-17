import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppContext } from '../../../contexts/AppContext';
import { createClusterRenderer } from './ClusterRenderer';
import { CustomTooltip, MultiEventTooltip, TooltipContent } from './MapTooltip';
import { getMarkerIcon, getRiskColor, groupMarkersByLocation } from './mapUtils';
import ResetZoomButton from './ResetZoomButton';

type LocationType = {
    name: string;
    location_type: 'city' | 'country';
};

export type MapMarker = {
    position: [number, number];
    title: string;
    risk_level: string;
    date: string;
    link: string;
    incident_type?: string;
    events?: MapMarker[];
};

export interface MapProps {
    markers: MapMarker[];
    isDarkMode?: boolean;
    mapId?: string;
    incidentTypes?: string[];
    dateRange?: {
        start: string;
        end: string;
    };
    locations?: LocationType[];
}

export interface MarkerWithData extends google.maps.marker.AdvancedMarkerElement {
    originalData?: MapMarker;
}

const MapComponent = ({ markers = [], isDarkMode = false, mapId } : MapProps) => {
    const { configs } = useAppContext();
    const mapIconsBaseUrl = configs?.map_icons_url || '';

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const [tooltipData, setTooltipData] = useState<{
        position: google.maps.LatLng;
        content: React.ReactNode;
    } | null>(null);
    const [isMapInitialized, setIsMapInitialized] = useState(false);
    const [initialBounds, setInitialBounds] = useState<google.maps.LatLngBounds | null>(null);
    const { ref: inViewRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    useEffect(() => {
        if (!inView || isMapInitialized) return;

        if (typeof google === 'undefined' || !google.maps) {
            console.error('Google Maps API not loaded');
            return;
        }

        const init = async () => {
            try {
                await initializeMap();
            } catch (error) {
                console.error('Error during map initialization:', error);
            }
        };

        init();
    }, [markers, isDarkMode, inView, isMapInitialized]);

    const resetMapZoom = () => {
        if (mapInstance.current && initialBounds) {
            mapInstance.current.fitBounds(initialBounds);
        }
    };

    const initializeMap = async () => {
        if (!mapRef.current) return;

        try {
            const [{ Map }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
                google.maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
                google.maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>
            ]);

            const bounds = new google.maps.LatLngBounds();
            markers.forEach(({ position }) => {
                bounds.extend({ lat: position[1], lng: position[0] });
            });

            setInitialBounds(bounds);

            mapInstance.current = new Map(mapRef.current, {
                zoom: 3,
                center: bounds.getCenter(),
                mapId,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_BOTTOM,
                },
            });

            if (markers.length > 0) {
                const mapMarkers = createMapMarkers(markers, AdvancedMarkerElement, PinElement);
                initializeClusterer(mapMarkers);
                mapInstance.current?.fitBounds(bounds);
            }
            
            setIsMapInitialized(true);
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    };

    const setupMarkerClickListener = (marker: MarkerWithData, markerData: MapMarker) => {
        marker.addListener("gmp-click", () => {
            let tooltipContent;
            if (markerData.events) {
                tooltipContent = (
                    <MultiEventTooltip
                        events={markerData.events}
                        isDarkMode={isDarkMode}
                    />
                );
            } else {
                tooltipContent = (
                    <TooltipContent
                        title={markerData.title}
                        link={markerData.link}
                        date={markerData.date}
                        isDarkMode={isDarkMode}
                    />
                );
            }
    
            setTooltipData({
                position: marker.position as google.maps.LatLng,
                content: tooltipContent
            });
        });
    };

    const createMapMarkers = (
        markers: MapMarker[], 
        AdvancedMarkerElement: any, 
        PinElement: any
    ) => {
        const groupedMarkers = groupMarkersByLocation(markers);

        return groupedMarkers.map((markerData) => {
            let markerContent;
            let marker: any = null;

            // Marker cluster
            if (markerData.events) {
                const label = document.createElement('div')
                label.innerHTML = markerData.events ? markerData.events.length.toString() : ""
                label.style.fontSize = '14px'
                label.style.color = 'white'
    
                const pinGlyph = new PinElement({
                    background: getRiskColor(markerData.risk_level),
                    borderColor: getRiskColor(markerData.risk_level),
                    glyph: label,
                    scale: 1.1
                });
                markerContent = pinGlyph.element;

            } else {    // Single marker
                const iconUrls = getMarkerIcon(markerData.incident_type, markerData.risk_level, mapIconsBaseUrl);

                if (iconUrls && mapIconsBaseUrl) {
                    const imageElement = document.createElement('img') as HTMLImageElement;
                    imageElement.src = iconUrls.specific;
                    imageElement.style.width = '32px';
                    imageElement.style.height = '38px';

                    imageElement.onerror = () => {
                        imageElement.src = iconUrls.default;

                        imageElement.onerror = () => {
                            const pinGlyph = new PinElement({
                                background: getRiskColor(markerData.risk_level),
                                borderColor: getRiskColor(markerData.risk_level),
                                scale: 1.1
                            });
                            
                            if (marker && marker.content) {
                                marker.content = pinGlyph.element;
                            }
                        };
                    };
                    
                    markerContent = imageElement;
                } else {
                    const pinGlyph = new PinElement({
                        background: getRiskColor(markerData.risk_level),
                        borderColor: getRiskColor(markerData.risk_level),
                        scale: 1.1
                    });
                    markerContent = pinGlyph.element;
                }
            }

            marker = new AdvancedMarkerElement({
                position: { 
                    lat: markerData.position[1], 
                    lng: markerData.position[0] 
                },
                map: mapInstance.current,
                title: markerData.title,
                content: markerContent,
            });

            marker.originalData = markerData;
            
            setupMarkerClickListener(marker, markerData);

            return marker;
        });
    };

    const initializeClusterer = (mapMarkers: google.maps.marker.AdvancedMarkerElement[]) => {
        if (!mapInstance.current) return;

        new MarkerClusterer({
            markers: mapMarkers,
            map: mapInstance.current,
            algorithm: new SuperClusterAlgorithm({
                maxZoom: 16,
                radius: 60
            }),
            renderer: createClusterRenderer()
        });
    };

    return (
        <div ref={inViewRef} className="w-full h-[300px] relative">
            {inView && (
                <>
                    <div ref={mapRef} className="w-full h-full">
                        {tooltipData && mapInstance.current && (
                            <CustomTooltip
                                map={mapInstance.current}
                                position={tooltipData.position}
                                content={tooltipData.content}
                                isDarkMode={isDarkMode}
                                onClose={() => setTooltipData(null)}
                            />
                        )}
                    </div>
                    {isMapInitialized && (
                        <ResetZoomButton
                            onReset={resetMapZoom}
                            isDarkMode={isDarkMode}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export const LoadingComponent = () => (
    <div className="mt-4 mb-8 w-full h-[300px] flex items-center justify-center bg-gray-100">
        Loading map...
    </div>
);

export const ErrorComponent = () => (
    <div className="mt-4 mb-8 w-full h-[300px] flex items-center justify-center bg-red-50 text-red-500">
        Error loading map
    </div>
);

const MapWidget = ({ 
    markers, 
    isDarkMode,
    incidentTypes = [],
    dateRange,
    locations = []
}: MapProps) => {
    const { configs } = useAppContext();
    const apiKey = configs?.map_api.api_key;
    const darkMapId = configs?.map_api.dark_map_id;
    const lightMapId = configs?.map_api.light_map_id;

    if (!apiKey) return null;

    const render = (status: Status) => {
        if (status === Status.LOADING) return <LoadingComponent />;
        if (status === Status.FAILURE) return <ErrorComponent />;
        return <MapComponent 
            markers={markers} 
            isDarkMode={isDarkMode} 
            mapId={isDarkMode ? darkMapId : lightMapId} 
        />;
    };

    const getLocationText = () => {
        if (locations?.length === 0) return "";

        const locationsByType = locations.reduce((acc, loc) => {
            if (!acc[loc.location_type]) {
                acc[loc.location_type] = [];
            }
            acc[loc.location_type].push(loc.name);
            return acc;
        }, {} as Record<string, string[]>);

        const parts = [];
        if (locationsByType.city) {
            parts.push(locationsByType.city.join(", "));
        }
        if (locationsByType.country) {
            parts.push(locationsByType.country.join(", "));
        }

        return parts.join(" / ");
    };

    const getDescription = () => {
        const types = incidentTypes?.length > 0 
            ? incidentTypes.join(", ") 
            : "all";

        const formatDate = (dateString: string) => {
            if (!dateString) return "";
            return dayjs(dateString).format('MMM D, YYYY');
        };
    
        const dates = dateRange 
            ? `${formatDate(dateRange.start)} — ${formatDate(dateRange.end)}`
            : "";

        const locationText = getLocationText();

        return `Map of ${types} incidents on the dates ${dates} in ${locationText}`;
    };

    return (
        <div className="w-full mt-4 mb-8">
            <Wrapper 
                apiKey={apiKey}
                version="beta"
                libraries={['places']}
                render={render}
            />
            <div className="w-full py-2 px-4 bg-primary-lt rounded-b-md flex items-center justify-center text-xs font-semibold">
                {getDescription()}
            </div>
        </div>
    );
};

export default MapWidget; 