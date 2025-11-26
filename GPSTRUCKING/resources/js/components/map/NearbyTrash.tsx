import { PickUpSite } from "./MapBarangay"
import { FullscreenControl, Layer, MapMouseEvent, MapRef, Source } from "@vis.gl/react-maplibre"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { GeolocateControl, Map, Marker, NavigationControl, ScaleControl, TerrainControl } from "@vis.gl/react-maplibre";
import { cn } from "@/lib/utils";
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
import { CircleCheck, MapPin, MapPinPlus, Pickaxe, Route, SkipForward, Trash2Icon, TriangleAlert, Truck } from "lucide-react";
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
import { disable } from "@/routes/two-factor";
import { CreateRoute } from "./CreateRoute";
import { LineRenderer } from "./LineRenderer";
import { EditRoute } from "./EditRoute";
import get from "@/routes/get";
import { User } from "@/types";
import { driver } from "@/routes";
import truck from "@/routes/truck";
import { Card, CardContent, CardDescription } from "../ui/card";


export default function NearbyTrash({dropSites, ref } : {
    dropSites: PickUpSite[];
    ref: MapRef;
}) {
    const [ drawerOpen, setDrawerOpen ] = useState(false);

    console.log("DROP", dropSites);
    const [ dropsiteData, setDropSiteData ] = useState(dropSites);

    useEffect(()=>{
        setDropSiteData(dropSites);
    }, [dropSites])

    return <>
        <Drawer onOpenChange={setDrawerOpen} open={drawerOpen} direction="right">
    <DrawerTrigger>
        <Button variant="outline">See Nearby Sites</Button>
    </DrawerTrigger>
            <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Nearby PickUp Sites</DrawerTitle>
                        <DrawerDescription>This area shows the drop sites in your area</DrawerDescription>

                        {
                        dropsiteData && dropSites.map(site => <div>
                            <MapPin/>
                            <div>{site.bin_name}</div>
                            <div>{site.distance}</div>
                        </div>)
                        }
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose>
                            <Button className="w-full" variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>
}
