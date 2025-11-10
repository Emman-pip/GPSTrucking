import { FullscreenControl, MapMouseEvent, MapRef } from "@vis.gl/react-maplibre"
import { GeolocateControl, Map, Marker, NavigationControl, ScaleControl, TerrainControl } from "@vis.gl/react-maplibre";
import { MAP_STYLE } from "./MapView"
import { useEffect, useRef, useState } from "react";
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
import { MapPinPlus } from "lucide-react";

export interface PickUpSite {
    id?: number;
    coordinates?: [number, number];
    image?: string;
    description?: string;
    barangay_id?: number;
    barangay?: string;
}


export default function MapBarangay({ barangayCoordinates }: {
    barangayCoordinates: [number, number]
}) {

    const mapRef = useRef<MapRef | null>(null);
    const map = mapRef.current?.getMap();

    const [newPickUpSite, setNewPickUpSite] = useState<PickUpSite>()

    const pickUpHandler = (e:MapMouseEvent) => {
        console.log("hi")
    }

    const [isMarking, setIsMarking] = useState<Boolean>(false)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleCreateMarker = () => {
        setIsMarking(true);
    }

    return <><Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        style={{ borderRadius: 19, height: 500 }}
        initialViewState={{
            longitude: barangayCoordinates[0], // Malvar default
            latitude: barangayCoordinates[1],
            zoom: 14,
        }}
        onMouseMove={() => {
            const map = mapRef.current?.getMap();
            if (!isMarking) {
                map.getCanvas().style.cursor = "";
                return;
            }
            console.log("here")
            map.getCanvas().style.cursor = "url('/resources/MapPinAdd.svg') 8 8, pointer"
        }}
        onClick={(e:MapMouseEvent) => {
            if (isMarking) {
                console.log("DONE");
                setIsMarking(false);
                setNewPickUpSite({ coordinates: [e.lngLat.lng, e.lngLat.lat ] })
                setDrawerOpen(true)
            }
        }}
    >
        <Marker longitude={barangayCoordinates[0]} latitude={barangayCoordinates[1]} anchor="center">
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

    { newPickUpSite && <Marker onClick={()=>setDrawerOpen(true)} longitude={newPickUpSite.coordinates[0]} latitude={newPickUpSite.coordinates[1]} anchor="center">
            <MapPinPlus className="h-10 w-10 bg-red-500 rounded-4xl text-white p-3" />
        </Marker>
    }
        <FullscreenControl />
    </Map>
        <section>
            <Button onClick={handleCreateMarker}>Create a Pickup Site</Button>
        </section>

        <Drawer onOpenChange={setDrawerOpen} open={drawerOpen} direction="right">
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
    </>
}
