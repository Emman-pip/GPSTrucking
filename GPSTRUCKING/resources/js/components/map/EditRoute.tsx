
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { MapPin, MapPinPlus, Trash } from "lucide-react";
import { router, SetDataAction, useForm, usePage } from "@inertiajs/react";
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
import MapBarangay, { PickUpSite, Route } from "./MapBarangay";
import { MapRetLocation } from "./MapRetLocation";
import { Select } from "../ui/select";
"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Combobox } from "./CreateRoute";


const days = [
  {
    value: "Monday",
    label: "Monday",
  },
  {
    value: "Tuesday",
    label: "Tuesday",
  },

  {
    value: "Wednesday",
    label: "Wednesday",
  },
  {
    value: "Thursday",
    label: "Thursday",
  },
  {
    value: "Friday",
    label: "Friday",
  },
  {
    value: "Saturday",
    label: "Saturday",
  },
  {
    value: "Sunday",
    label: "Sunday",
  },
]
export function EditRoute({
    setOpen,
    open,
    refreshData,
    route,
    withControls,
    } : {
        setOpen: Dispatch<SetStateAction<boolean>>;
        open: boolean;
        refreshData:()=>void;
        route: Route|null;
        withControls: boolean;
    }) {
    const {data, setData, post, processing, errors} = useForm({
        'day_of_the_week': route?.schedule.day_of_the_week,
        'time': route?.schedule.time,
        'coordinates': route?.coordinates,
    });

    useEffect(()=>{
        setData(prev => ({...prev, coordinates: route?.coordinates }))
        setData(prev => ({...prev, time: route?.schedule.time }))
        setData(prev => ({...prev, day_of_the_week: route?.schedule.day_of_the_week }))
    }, [open])

    const handleSave = (e:FormEvent) => {
        e.preventDefault();
        () => setData(prev => ({...prev, coordinates: route?.coordinates }))
        console.log(data, route);
    }

    return <Dialog onOpenChange={setOpen}
                   open={open}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle >
                    <div className="flex justify-between items-center">
                        {withControls ? "Edit Route" : "Route Schedule"}
                        <Trash className="text-red-300 cursor-pointer transition-all duration-100 hover:text-red-500"/>
                    </div>
                </DialogTitle>
                <form onSubmit={handleSave}>
                <DialogDescription>
                        <div className="space-y-2">
                            <Combobox setValue={setData} value={data} />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input onChange={(e) => setData(prev => ({...prev, time: e.target.value }))} value={data.time} type="time" required />
                        </div>
                </DialogDescription>
                    <DialogFooter className="pt-2">
                        <Button type="submit">Save</Button>
                    <DialogClose>
                        <Button variant="outline" className="">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
                </form>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}
