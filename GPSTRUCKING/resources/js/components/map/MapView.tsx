import { GeolocateControl, Map, Marker, NavigationControl, ScaleControl, TerrainControl } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState, useRef } from "react";
import type { MapRef, MapStyle } from "@vis.gl/react-maplibre";
import { LucideTrash, MapPin, MapPinCheck, MapPinned, MapPinOff, Trash, Trash2 } from "lucide-react";
import { type } from "os";

export const MAP_STYLE: MapStyle = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
          // "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          !document.documentElement.classList.contains('dark') ? "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}.png"
          : "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19
    },
    terrainSource: {
      type: "raster-dem",
      url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
      tileSize: 256
    }
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm"
    }
  ],
  terrain: {
    source: "terrainSource",
    exaggeration: 1
  },
  sky: {}
};

export interface DropSite {
    longitude: number,
    latitude: number,
    description: string,
}

const sampleDropSites: DropSite[] = [
    // {
    //     longitude: 121.10080361366272,
    //     latitude: 14.08910798929304,
    //     description: "sample dropsite one"
    // },
    // {
    //     longitude: 121.10180139541626,
    //     latitude: 14.089924866252261,
    //     description: "sample dropsite two"
    // },
    // {
    //     longitude: 121.09885096549988,
    //     latitude: 14.08833793699894,
    //     description: "sample dropsite three",
    // }
]

async function getFallbackLocation() {
  const res = await fetch("https://location.services.mozilla.com/v1/geolocate?key=test", {
    method: "POST",
    body: JSON.stringify({ considerIp: "true" })
  });
  const data = await res.json();
  return {
    latitude: data.location.lat ?? data.latitude,
    longitude: data.location.lng ?? data.longitude
  };
}

export default function MapView() {
  const [position, setPosition] = useState<{ longitude: number; latitude: number } | null>(null);
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    // Try to get browser location first
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Browser location:", pos.coords);
        setPosition({ longitude: pos.coords.longitude, latitude: pos.coords.latitude });
      },
      (err) => {
        console.warn("Geolocation failed:", err.message);
        // const loc = await getFallbackLocation();
        // setPosition({ longitude: loc.longitude, latitude: loc.latitude });
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Whenever position updates, fly to that point
  useEffect(() => {
    if (mapRef.current && position) {
      mapRef.current.flyTo({
        center: [position.longitude, position.latitude],
        zoom: 1,
        speed: 1.2,
      });
    }
  }, [position]);


  useEffect(() => {
    const map = mapRef.current?.getMap();

    if (!map) return;

    // Wait until the map is ready
    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
                [121.10572814941406, 14.091251634701536],
                [121.10435485839844, 14.09118919871213],
                [121.10246658325195, 14.090335905145338],
                [121.09961271286011, 14.088816618460214],
                [121.09727382659912, 14.087401383411077],
                [121.09476327896118, 14.085986139589451],
                [121.09135150909424, 14.084113009279264],
            ],
          },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#007bff",
          "line-width": 4,
        },
      });
    });
  }, []);

  const [hover, setHover] = useState(false);

  return (
    <div className="w-full h-[500px]">
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        style={{ borderRadius: 19}}
        initialViewState={{
          longitude: 121.1586, // Malvar default
          latitude: 14.0447,
          zoom: 13,
        }}

        onClick={e => {
            console.log([e.lngLat.lng, e.lngLat.lat])
        }}
        maxBounds={[
            [121.08, 13.93],
            [121.20, 14.10]
        ]}
      >
        <NavigationControl />
        <ScaleControl />
        <GeolocateControl />

        {position &&
            <Marker longitude={position.longitude} latitude={position.latitude} anchor="center">
                <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="relative flex flex-col items-center"
                >
                {/* Marker icon */}
                <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-md"></div>

                {/* Tooltip */}
                {hover && (
                    <div className="absolute bottom-6 bg-white text-black text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                    {'YOU ARE HERE'}
                    </div>
                )}
                </div>
            </Marker>
        }

        { sampleDropSites.length > 0 && sampleDropSites.map((dropsite) => {
            const [ hover, setHover ] = useState(false);
            return <Marker longitude={dropsite.longitude} latitude={dropsite.latitude} anchor="center">
                <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="relative flex flex-col items-center"
                >
                <LucideTrash className="w-5 h-5 text-green-600 bg-white p-1.5 rounded-full border-2 border-green-600 shadow-lg hover:scale-400 transition-transform" />

                {hover && (
                    <div className="absolute bottom-6 bg-white text-black text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                    {dropsite.description}
                    </div>
                )}
                </div>
            </Marker>
        })}
        </Map>
    </div>
  );
}

