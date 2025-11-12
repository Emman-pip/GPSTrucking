import { Layer, MapRef, Source } from "@vis.gl/react-maplibre";
import { Route } from "./MapBarangay";
import { useEffect, useRef } from "react";
import { Map } from "maplibre-gl";

export function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}


export function LineRenderer({
    route,
    index = 1,
    map,
    onClick
}: {
    route: Route;
    index?: number;
    map: Map;
    onClick: (route: Route) => void;
}) {
    const lineGeoJSON = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: route?.coordinates
            }
        }]
    }; //: null;
    const color = getRandomRGB();
    function onHover() {
        map.getCanvas().style.cursor = "pointer";
    }

  // Add event listeners for hover interactions
    useEffect(() => {
        const handleMouseEnter = (event: any) => {
            const features = event.target.queryRenderedFeatures(event.point);
            const lineFeature = features.find((f: any) => f.layer.id === `line-${index}`);
            if (lineFeature) {
                // Trigger the hover event
                onHover && onHover();
            }
        };

        const handleClick = (event:any) => {
            const features = event.target.queryRenderedFeatures(event.point);
            const lineFeature = features.find((f: any) => f.layer.id === `line-${index}`);

            if (lineFeature) {
                // Trigger the hover event
                onClick && onClick(route);
            }
        }

        map?.on('click', `line-${index}`, handleClick);
        map?.on('mousemove', `line-${index}`, handleMouseEnter);

        return () => {
            map?.off('click', `line-${index}`, handleClick);
            map?.off('mousemove', `line-${index}`, handleMouseEnter);
        };
    }, [index, onHover]);

    return <Source key={`rendered-line-${index}`} type="geojson" data={lineGeoJSON}>
        <Layer
            id={`line-${index}`}
            type="line"
            paint={{
                'line-color': color,
                'line-width': 8,
                'line-opacity': 0.7
            }}
        ></Layer>
    </Source>
}
