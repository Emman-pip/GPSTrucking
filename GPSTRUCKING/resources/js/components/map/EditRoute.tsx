
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
    const {data, setData, put, processing, errors} = useForm({
        'sched_id': route?.schedule.id,
        'day_of_the_week': route?.schedule.day_of_the_week,
        'time': route?.schedule.time,
    });

    useEffect(()=>{
        setData(prev => ({...prev, time: route?.schedule.time }))
        setData(prev => ({...prev, day_of_the_week: route?.schedule.day_of_the_week }))
        setData(prev => ({...prev, sched_id: route?.schedule.id }))
    }, [open])

    const handleSave = (e:FormEvent) => {
        e.preventDefault();
        put(barangay.update.route().url, {
            onSuccess: ()=>{router.get("#")},
            onError: (e)=>console.log("ERROR", e)
        })
    }

    const handleDelete = () => {
        router.delete(barangay.delete.route(route?.id).url, {
            onSuccess: ()=>{router.get("#")},
            onError: (e)=>console.log("ERROR", e)
        })
    }

function formatTime(time: string) {
    if (!time?.split) return time;
  const [hour, minute] = time?.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute));

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}


    return <Dialog onOpenChange={setOpen}
                   open={open}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle >
                    <div className="flex justify-between items-center">
                        {withControls ? "Edit Route" : "Route Schedule"}
                    </div>
                </DialogTitle>
                <DialogDescription>
                    { withControls &&
                        <form onSubmit={handleSave}>
                        <div className="space-y-2">
                            {withControls ? <Combobox setValue={setData} value={data} /> : <Input type="text" value={data.day_of_the_week} disabled />}
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input disabled={!withControls} onChange={(e) => setData(prev => ({ ...prev, time: e.target.value }))} value={data.time} type="time" required />
                        </div>
                        {withControls && <Button className="mt-2 w-full" type="submit">Save</Button>}
                    </form>
                    }
                    { !withControls && <div>
                        <div>This route is scheduled every:</div>
                        <div className="text-center font-bold p-2 text-lg">{data.day_of_the_week}
                        <span>{" " + formatTime(data.time)}</span>
                        </div>
                        </div>}
                </DialogDescription>
                    <DialogFooter className="pt-2 flex justify-between w-full items-center">
                        {withControls && <Trash onClick={() => handleDelete()} className="text-red-300 cursor-pointer transition-all duration-100 hover:text-red-500"/>}
                        <DialogClose>
                            <Button variant="outline" className="">{withControls ? 'Cancel' : "Close"}</Button>
                        </DialogClose>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}
