
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
import MapBarangay, { PickUpSite } from "./MapBarangay";
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
export function Combobox({ setValue, value }: {
    setValue: SetDataAction<{
        day_of_the_week: null;
        time: null;
        coordinates: [number, number][];
    }>;
    value: {
        day_of_the_week: null;
        time: null;
        coordinates: [number, number][];
    }

}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value.day_of_the_week
            ? days.find((day) => day.value === value.day_of_the_week)?.label
            : "Select day..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {days.map((day) => (
                <CommandItem
                  key={day.value}
                  value={day.value}
                  onSelect={(currentValue) => {
                    setValue((prev) => ({...prev, day_of_the_week: currentValue === value ? "" : currentValue }));
                    setOpen(false)
                  }}
                >
                  {day.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value.day_of_the_week === day.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function CreateRoute({setOpen, open, refreshData, coordinatesArray, setCoordinates} : {
    setOpen: Dispatch<SetStateAction<boolean>>;
    setCoordinates: Dispatch<SetStateAction<[number, number][]>>;
    open: boolean;
    refreshData:void;
    coordinatesArray: [number, number][]
}) {
    const {data, setData, post, processing, errors} = useForm({
        'day_of_the_week': null,
        'time': null,
        'coordinates': coordinatesArray,
    });
    useEffect(()=>{
        setData(prev => ({ ...prev, coordinates: coordinatesArray }));
    }, [coordinatesArray]);
    const handleSave = (e:FormEvent) => {
        if (!e.target.checkValidity()){
            return;
        }

        e.preventDefault();
        post(barangay.create.route().url, {
            onSuccess: () => {
                refreshData();
            },
            onError: e => console.log(e)
        });
    }

    return <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle >
                    <div className="flex justify-between items-center">
                        New Route
                    </div>
                </DialogTitle>
                <form onSubmit={handleSave}>
                <DialogDescription>
                        <div className="space-y-2">
                            <Combobox setValue={setData} value={data} />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input onChange={(e) => setData(prev => ({...prev, time: e.target.value }))} type="time" required />
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
