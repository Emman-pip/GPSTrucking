import { FullscreenControl, MapMouseEvent, MapRef } from "@vis.gl/react-maplibre"
import { GeolocateControl, Map, Marker, NavigationControl, ScaleControl, TerrainControl } from "@vis.gl/react-maplibre";
import { DropSite, MAP_STYLE } from "./MapView"
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
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
import { MapPin, MapPinPlus } from "lucide-react";
import { router, useForm, usePage } from "@inertiajs/react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import barangay from "@/routes/barangay";
import { Spinner } from "../ui/spinner";
import DropSiteController from "@/actions/App/Http/Controllers/DropSiteController";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { error } from "console";
import { EditDropSite } from "./EditDropSite";

export function MapRetLocation({ update, open, setOpen, coordinates, refresh  }:
    {
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
        coordinates: [number, number];
        update: void
        refresh: void
    }) {
    let mapRef = useRef<MapRef | null>(null);
    const [isMarking, setIsMarking] = useState<Boolean>(false)
    useEffect(() => {
        setIsMarking(true);
    }, [])
    return <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        style={{ height: 500 }}
        maxBounds={[
            [121.08, 13.93],
            [121.20, 14.10]
        ]}
        initialViewState={{
            longitude: coordinates[0], // Malvar default
            latitude: coordinates[1],
            zoom: 17,
        }}

        onMouseMove={() => {
            const map = mapRef.current?.getMap();
            if (!isMarking) {
                map.getCanvas().style.cursor = "";
                return;
            }
            map.getCanvas().style.cursor = "url('/resources/MapPinAdd.svg') 8 8, pointer"
        }}
        onClick={(e: MapMouseEvent) => {
            if (isMarking) {
                setIsMarking(false);
                setOpen(false);
                update([e.lngLat.lng, e.lngLat.lat]);
                refresh();
            }
        }}
    >
        <GeolocateControl />
        <Marker longitude={coordinates[0]} latitude={coordinates[1]} className="flex flex-col gap-2">
            <div className="text-xl capitalize">LAST LOCATION</div>
            <Marker longitude={coordinates[0]} latitude={coordinates[1]}/>
        </Marker>
    </Map>
}
