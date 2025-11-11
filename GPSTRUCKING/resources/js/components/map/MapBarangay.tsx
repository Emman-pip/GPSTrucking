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

export interface PickUpSite {
    id?: number;
    coordinates?: [number, number];
    image?: string;
    description?: string;
    barangay_id?: number;
    barangay?: string;
}

function EditDropSite({setOpen, open, pickUpSite} : { setOpen: Dispatch<SetStateAction<boolean>>; open: boolean; pickUpSite: PickUpSite }) {
    const {data, setData, post, processing} = useForm({
        coordinates: pickUpSite?.description,
        image: pickUpSite?.description,
        description: pickUpSite?.description
    })

    useEffect(()=>{
        setData({
            coordinates: pickUpSite?.description,
            image: pickUpSite?.description,
            description: pickUpSite?.description
        })
    }, [ open ])
    return <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Pick Up Site</DialogTitle>
                <DialogDescription>
                    <form>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="image">Image of the Site</Label>
                            <Input id="image" name="image" type="file" onChange={e => setData(prev => ({ ...prev, "image": e.target.files[0] }))} required />
                            <Button type="submit">Update Photo</Button>
                        </div>
                    </form>
                    <form>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))} value={data?.description} required/>
                        <Button>Save Description</Button>
                        </div>
                    </form>
                    <Button className="w-full mt-2" variant="secondary"><MapPin/>Reposition Marker</Button>
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


export default function MapBarangay({ barangayCoordinates, withControls = false }: {
    barangayCoordinates: [number, number],
    withControls?: boolean
}) {

    const mapRef = useRef<MapRef | null>(null);
    const map = mapRef.current?.getMap();
    const user = usePage().props.auth.user;

    const [dropSites, setDropSites] = useState<PickUpSite[]>();
    console.log(`${window.location.origin}${barangay.get.dropsites().url}?barangay_id=${user.barangay_official_info.barangay_id}`);

    function getDropsites() {
        fetch(`${window.location.origin}${barangay.get.dropsites().url}?barangay_id=${user.barangay_official_info.barangay_id}`)
            .then(res => res.json())
            .then(res => setDropSites(res))
    }

    useEffect(()=>{
        getDropsites();

        document.body.onkeydown = (e) => {
            if (e.key == 'Escape') {
                setIsMarking(false);
                setNewPickUpSite({
                    coordinates: null,
                    image: null,
                    description: null
                });
            }
        }
    }, [])

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
                getDropsites();
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
    const [openEdit, setOpenEdit] = useState(false)
    const [dropSiteToEdit, setDropSiteToEdit] = useState<PickUpSite | null>(null)

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
        maxBounds={[
            [121.08, 13.93],
            [121.20, 14.10]
        ]}
        onMouseMove={() => {
            if (!withControls) return;
            const map = mapRef.current?.getMap();
            if (!isMarking) {
                map.getCanvas().style.cursor = "";
                return;
            }
            console.log("here")
            map.getCanvas().style.cursor = "url('/resources/MapPinAdd.svg') 8 8, pointer"
        }}
        onClick={(e:MapMouseEvent) => {
            if (isMarking && withControls) {
                console.log("DONE");
                setIsMarking(false);
                setNewPickUpSite({ coordinates: [e.lngLat.lng, e.lngLat.lat ] })
                setDrawerOpen(true)
            }
        }}
    >
    {dropSites && dropSites.map(dropsite => {
        try {
            dropsite.coordinates = JSON.parse(dropsite.coordinates);
        } catch {}
        console.log(dropsite);
        return <Marker  key={dropsite.id} longitude={dropsite?.coordinates[0]} latitude={dropsite?.coordinates[1]} anchor="center">
            <Drawer direction="bottom">
                <DrawerTrigger><MapPin size={30} className="cursor-pointer p-1 hover:scale-210 transition-all duration-100 shadow-xl bg-green-500 text-white rounded-3xl"/></DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Pick Up Site Information</DrawerTitle>
                        <DrawerDescription className="flex flex-col items-center justify-center">
                            <div className="break-all">{dropsite.description}</div>
                            <img className="w-[50vh]" src={window.location.origin + '/storage/' + dropsite.image}/>
                        </DrawerDescription>

                    </DrawerHeader>
                    <DrawerFooter>
                        <div className="flex justify-center gap-2">
                            {withControls && <Button className="w-fit" onClick={() => {
                                setDropSiteToEdit(dropsite);
                                setOpenEdit(true);
                            }}>Edit</Button>}
                            <DrawerClose>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Marker>
    })}

        {newPickUpSite?.coordinates && <Marker onClick={() => setDrawerOpen(true)} longitude={newPickUpSite.coordinates[0]} latitude={newPickUpSite.coordinates[1]} anchor="center">
            <MapPinPlus className="h-10 w-10 bg-red-500 rounded-4xl text-white p-3" />
        </Marker>
    }
        <FullscreenControl />
    </Map>
        { withControls && <section>
            <Button onClick={handleCreateMarker}>Add a Pickup Site</Button>
        </section>
        }

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
                            <Button className="w-full" variant="outline" onClick={() =>{
                                setIsMarking(false)
                                setNewPickUpSite(prev => ({...prev, coordinates: null}))
                            }
                            }>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
        <EditDropSite open={openEdit} setOpen={setOpenEdit} pickUpSite={dropSiteToEdit}/>
    </>
}
