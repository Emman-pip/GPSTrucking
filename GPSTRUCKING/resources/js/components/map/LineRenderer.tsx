import { Layer, Source } from "@vis.gl/react-maplibre";
import { Route } from "./MapBarangay";

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
    index = 1
}: {
    route: Route;
    index?: number;
}) {
    const lineGeoJSON = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: route.coordinates
            }
        }]
    }; //: null;
    const color = getRandomRGB();
    console.log("HEREEEE", color);
    return <Source key={`rendered-line-${index}`} type="geojson" data={lineGeoJSON}>
        <Layer
            id={`line-${index}`}
            type="line"
            paint={{
                'line-color': color,
                'line-width': 6,
                'line-opacity': 0.7
            }}
        ></Layer>
    </Source>
}
