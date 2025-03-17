import { Cluster, ClusterStats } from '@googlemaps/markerclusterer';
import { getRiskColor, calculateClusterRisk, getTotalEventsInCluster } from './mapUtils';
import { createRoot } from 'react-dom/client';

interface ClusterElementProps {
    count: number;
    riskLevel: string;
    scale: number;
}

export const ClusterElement = ({ count, riskLevel, scale } : ClusterElementProps) => {
    const color = getRiskColor(riskLevel);
    const size = `${30 * scale}px`;

    return (
        <div 
            className="cluster-marker"
            style={{
                cursor: 'pointer',
                width: size,
                height: size,
                lineHeight: size,
                borderRadius: '50%',
                backgroundColor: color,
                color: 'white',
                textAlign: 'center',
                fontSize: '14px',
                transition: 'transform 0.2s ease-in-out, z-index 0.2s'
            }}
            onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.transform = 'scale(1.1)';
                target.style.zIndex = '1000';
                target.style.borderColor = 'black';
                target.style.borderWidth = '1px';
            }}
            onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.transform = 'scale(1)';
                target.style.zIndex = 'auto';
                target.style.borderWidth = '0px';
            }}
        >
            {count}
        </div>
    );
};

export const createClusterRenderer = () => ({
    render: (
        cluster: Cluster,
        stats: ClusterStats,
        map: google.maps.Map
    ): google.maps.marker.AdvancedMarkerElement => {
        const totalEvents = getTotalEventsInCluster(cluster);
        const position = cluster.position;
        const riskLevel = calculateClusterRisk(cluster, stats, map);
        const size = totalEvents < 10 ? 'small' : totalEvents < 100 ? 'medium' : 'large';
        const scale = size === 'small' ? 1 : size === 'medium' ? 1.2 : 1.4;

        const element = document.createElement('div');
        const root = createRoot(element);
        root.render(
            <ClusterElement 
                count={totalEvents} 
                riskLevel={riskLevel} 
                scale={scale} 
            />
        );

        return new google.maps.marker.AdvancedMarkerElement({
            position,
            content: element
        });
    }
});