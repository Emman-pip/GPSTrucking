
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
import MapBarangay, { PickUpSite } from "./MapBarangay";
import { MapRetLocation } from "./MapRetLocation";

export function EditDropSite({setOpen, open, pickUpSite, refreshData} : { setOpen: Dispatch<SetStateAction<boolean>>; open: boolean; pickUpSite: PickUpSite, refreshData:void }) {
    const {data, setData, put, processing, errors} = useForm({
        id: pickUpSite?.id,
        coordinates: pickUpSite?.coordinates,
        image: pickUpSite?.image,
        description: pickUpSite?.description,
    })

    useEffect(()=>{
        setData({
            id: pickUpSite?.id,
            coordinates: pickUpSite?.coordinates,
            image: pickUpSite?.image,
            description: pickUpSite?.description
        })
    }, [ open ])

    const handleUpdateDescription = (e:FormEvent) => {
        if (!e.target.checkValidity()){
            return;
        }
        e.preventDefault();
        console.log("HEREE")
        put(barangay.update.dropsites.description().url, {
            onSuccess: ()=>{
                refreshData();
                setOpen(false);
            },
            onError: (e) => console.log("error", e)
        })
    }

    const handleUpdateImage = (e:FormEvent) => {
        if (!e.target.checkValidity()){
            return;
        }
        e.preventDefault();
        console.log("HEREE")
        router.post(barangay.update.dropsites.image().url,
                    {...data, _method:'put'},
                    {
            forceFormData:true,
            onSuccess: ()=>{
                refreshData();
                setOpen(false);
            },
            onError: (e) => console.log("error", e)})
        /* put(barangay.update.dropsites.image().url, {
*     onSuccess: ()=>{
*         refreshData();
*         setOpen(false);
*     },
*     onError: (e) => console.log("error", e) */
        /* }) */
    }

    const [ openRelocate, setOpenRelocate ] = useState(false);

    const handleCoordinatesUpdate = (coords: [number, number]) => {
        router.put(barangay.update.dropsites.coordinates().url, {
            'id': pickUpSite?.id,
            'coordinates': coords
        }, {
            onSuccess: () => refreshData(),
        });
    }

    return <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Pick Up Site</DialogTitle>
                <DialogDescription>
                    <form onSubmit={handleUpdateImage}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="image">Image of the Site</Label>
                            <Input id="image" name="image" type="file" onChange={e => {
                                setData(prev => ({ ...prev, id: pickUpSite.id }))
                                setData(prev => ({ ...prev, "image": e.target.files[0] }))
                            }} required />
                            {errors?.image && <div className="text-red-500">{errors?.image}</div>}
                            <Button type="submit">Update Photo</Button>
                        </div>
                    </form>
                    <form onSubmit={handleUpdateDescription}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea onChange={(e) => {
                                setData(prev => ({ ...prev, description: e.target.value }))
                                setData(prev => ({ ...prev, id: pickUpSite.id }))
                            }} value={data?.description} required/>
                            {errors?.description && <div className="text-red-500">{errors?.description}</div>}
                            <Button>Save Description</Button>
                        </div>
                    </form>
                    <Dialog onOpenChange={setOpenRelocate} open={openRelocate}>
                        <DialogTrigger>
                            <Button className="w-full mt-2" variant="secondary"><MapPin/>Reposition Marker</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <MapRetLocation coordinates={pickUpSite?.coordinates} open={openRelocate}  setOpen={ setOpenRelocate } update={handleCoordinatesUpdate} refresh={refreshData}/>
                        </DialogContent>
                    </Dialog>
                </DialogDescription>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline" className="">Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}
