import { FullscreenControl, MapMouseEvent, MapRef } from "@vis.gl/react-maplibre"
import { GeolocateControl, Map, Marker, NavigationControl, ScaleControl, TerrainControl } from "@vis.gl/react-maplibre";
import { MAP_STYLE } from "./MapView"
import { FormEvent, useEffect, useRef, useState } from "react";
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
import { router, useForm } from "@inertiajs/react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import barangay from "@/routes/barangay";
import { Spinner } from "../ui/spinner";

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

    const {data:newPickUpSite, setData:setNewPickUpSite, post, processing} = useForm({
        coordinates: null,
        image: null,
        description: null
    })

    const submitNewPickUpSite = (e:FormEvent) => {
        e.preventDefault();
        console.log('Submitting', newPickUpSite);

        post(barangay.new.dropsite().url, {
            forceFormData: true,
            onSuccess: () => {
                setDrawerOpen(false);
                setIsMarking(false);
                setNewPickUpSite({
                    coordinates: null,
                    image: null,
                    description: null
                });
            },
            onError: (e)=>console.log(e)
        }
        )
    }

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

        {newPickUpSite?.coordinates && <Marker onClick={() => setDrawerOpen(true)} longitude={newPickUpSite.coordinates[0]} latitude={newPickUpSite.coordinates[1]} anchor="center">
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
                <form onSubmit={submitNewPickUpSite}>
                    <DrawerHeader>
                        <DrawerTitle>New Pick Up Site</DrawerTitle>
                        <DrawerDescription>This action will be visible to all stakeholders. Are you absolutely sure this is accurate?</DrawerDescription>

                        <div>
                            <Label htmlFor="image">Image of the Site <small>optional</small></Label>
                            <Input id="image" name="image" type="file" onChange={e => setNewPickUpSite(prev => ({...prev, "image": e.target.files[0] }))} />
                        </div>
                        <div>
                            <Label htmlFor="description">Description <small>*</small></Label>
                            <Textarea onChange={(e) => setNewPickUpSite(prev =>({...prev, "description": e.target.value }))} id="description" name="description" required/>
                        </div>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button type="submit" disabled={processing}> {processing && <Spinner/>}Add new pickup site</Button>
                        <DrawerClose>
                            <Button className="w-full" variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    </>
}
