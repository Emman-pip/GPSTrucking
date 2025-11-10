import { MapRef } from "@vis.gl/react-maplibre"
import { GeolocateControl, Map, Marker, NavigationControl, ScaleControl, TerrainControl } from "@vis.gl/react-maplibre";
import { MAP_STYLE } from "./MapView"
import { useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "../ui/button";



export default function MapBarangay({ coordinates }:
                                    {
                                        barangayCoordinates: [number, number]
                                    }) {

  const mapRef = useRef<MapRef | null>(null);
    const map = mapRef.current?.getMap();
    return <><Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        style={{ borderRadius: 19, height: 500}}
        initialViewState={{
          longitude: coordinates[0], // Malvar default
          latitude: coordinates[1],
          zoom: 14,
        }}>
            <Marker longitude={coordinates[0]} latitude={coordinates[1]} anchor="center">
                <Drawer direction="right">
                    <DrawerTrigger>Open</DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                            <DrawerDescription>This action cannot be undone.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button>Submit</Button>
                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Marker>
        </Map>

        </>
}
