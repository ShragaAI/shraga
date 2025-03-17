import { Cluster, ClusterStats } from "@googlemaps/markerclusterer";
import { MapMarker, MarkerWithData } from "./MapWidget";

export const getRiskColor = (risk_level: string): string => {
    const colors: Record<string, string> = {
        extreme: '#EC2627',
        high: '#E89F23',
        medium: '#67307B',
        low: '#0FA54E',
        default: '#6B7280'
    };
    return colors[risk_level?.toLowerCase()] || colors.default;
};

export const getHighestRiskLevel = (events: MapMarker[]): string => {
    const riskLevels = events.map(event => event.risk_level.toLowerCase());
    if (riskLevels.includes('extreme')) return 'extreme';
    if (riskLevels.includes('high')) return 'high';
    if (riskLevels.includes('medium')) return 'medium';
    if (riskLevels.includes('low')) return 'low';
    return 'default';
};

export const formatNameForFile = (name: string | undefined): string => {
    if (!name) return 'default';
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
};

export const calculateClusterRisk = (
    cluster: Cluster,
    _stats: ClusterStats,
    _map: google.maps.Map
): string => {
    if (!cluster.markers) return 'default';

    const markers = cluster.markers as MarkerWithData[];
    const riskLevels = markers
        .map(marker => marker.originalData?.risk_level?.toLowerCase())
        .filter((risk): risk is string => !!risk);

    if (riskLevels.includes('extreme')) return 'extreme';
    if (riskLevels.includes('high')) return 'high';
    if (riskLevels.includes('medium')) return 'medium';
    if (riskLevels.includes('low')) return 'low';

    return 'default';
};

export const getTotalEventsInCluster = (cluster: Cluster): number => {
    const markers = cluster.markers as { originalData?: MapMarker }[];
    return markers.reduce((total, marker) => {
        return total + (marker.originalData?.events?.length || 1);
    }, 0);
};


export const groupMarkersByLocation = (markers: MapMarker[]): MapMarker[] => {
    const groupedMarkersMap = new Map<string, MapMarker[]>();
    
    markers.forEach(marker => {
        const key = `${marker.position[0]},${marker.position[1]}`;
        if (!groupedMarkersMap.has(key)) {
            groupedMarkersMap.set(key, []);
        }
        groupedMarkersMap.get(key)!.push(marker);
    });
    
    return Array.from(groupedMarkersMap.values()).map(group => {
        if (group.length === 1) return group[0];
        
        const highestRiskLevel = getHighestRiskLevel(group);
        
        return {
            position: group[0].position,
            title: `${group.length} events at this location`,
            risk_level: highestRiskLevel,
            date: group[0].date,
            link: group[0].link,
            incident_type: group[0].incident_type,
            events: group
        };
    });
};

export function getMarkerIcon(incidentType: string | undefined, riskLevel: string, baseUrl: string) {
    if (!baseUrl) return null;

    const iconBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    const formattedType = formatNameForFile(incidentType);
    const formattedRisk = formatNameForFile(riskLevel);
    
    const specificIconUrl = `${iconBaseUrl}${formattedType}_${formattedRisk}.png`;
    const defaultRiskIconUrl = `${iconBaseUrl}default_${formattedRisk}.png`;
    
    return {
        specific: specificIconUrl,
        default: defaultRiskIconUrl
    };
}