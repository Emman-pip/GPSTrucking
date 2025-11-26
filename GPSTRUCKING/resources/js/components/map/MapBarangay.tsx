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

export interface PickUpSite {
    id?: number;
    bin_name?: string;
    coordinates?: [number, number];
    image?: string;
    description?: string;
    barangay_id?: number;
    barangay?: string;
}

export interface PickUpSched {
    id?:number;
    day_of_the_week?:string;
    time?:string;
    barangay_id?: number;
}

export interface Route {
    id?: number;
    barangay_id?: number;
    coordinates?: [number, number][];
    pickup_id?: number;
    schedule: PickUpSched;
};

export interface PickUpSite {
    id?: number;
    coordinates?: [number, number];
    image?: string;
    description?: string;
    barangay_id?: number;
    barangay?: string;
}


function getDistanceInMeters(coord1:[number, number], coord2:[number,number]) {
    const R = 6371000; // Earth radius in meters
    const toRad = x => x * Math.PI / 180;

    const dLat = toRad(coord2[1] - coord1[1]);
    const dLon = toRad(coord2[0] - coord1[0]);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1[1])) * Math.cos(toRad(coord2[1])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in meters
}


// TODO ROUTES!!!!
// manually add routes by hand

export default function MapBarangay({ barangayCoordinates, withControls = false, userData = null, zoom = 14, isDriver = false }: {
    barangayCoordinates: [number, number],
    withControls?: boolean,
    userData?: null|User,
    zoom?: number,
    isDriver?: boolean
}) {

    const mapRef = useRef<MapRef | null>(null);
    const map = mapRef.current?.getMap();
    const user:User = userData !== null ? userData : usePage().props.auth.user;

    const [dropSites, setDropSites] = useState<PickUpSite[]>();
    const [routes, setRoutes] = useState<Route[]>();

    function refresh() {
        setIsMarking(false);
        setIsSettingRoute(false);
        setOpenEdit(false);
        setOpenNewRoute(false);
        setPoints([]);
        setOpenEditRoute(false);

        fetch(`${window.location.origin}${get.dropsites().url}?barangay_id=${user.barangay_official_info?.barangay_id ? user.barangay_official_info.barangay_id : user.residency.barangay_id}`)
            .then(res => res.json())
            .then(res => setDropSites(res))

        console.log(`${window.location.origin}${get.routes().url}`);
        // fetch(`${window.location.origin}${get.routes().url}`)
        //     .then(res => res.json())
        //     .then(res => {
        //         res.map(datum => datum.coordinates = JSON.parse(datum.coordinates));
        //         setRoutes(res);
        //     })
        fetch(`${window.location.origin}${get.routes.driver(user.barangay_official_info?.barangay_id ? user.barangay_official_info.barangay_id : user.residency.barangay_id).url}`)
            .then(res => res.json())
            .then(res => {
                res.map(datum => datum.coordinates = JSON.parse(datum.coordinates));
                setRoutes(res);
            })
    }

    useEffect(()=>{
        refresh();

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
        bin_name: null,
        coordinates: null,
        image: null,
        description: null
    })

    const submitNewPickUpSite = (e:FormEvent) => {
        e.preventDefault();
        /* console.log('Submitting', newPickUpSite); */

        post(barangay.new.dropsite().url, {
            forceFormData: true,
            onSuccess: () => {
                setDrawerOpen(false);
                setIsMarking(false);
                setNewPickUpSite({
                    bin_name: null,
                    coordinates: null,
                    image: null,
                    description: null
                });
                refresh();
            },
            onError: (e)=>console.log(e)
        }
        )
    }

    const [isMarking, setIsMarking] = useState<Boolean>(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openNewRoute, setOpenNewRoute] = useState(false)
    const [dropSiteToEdit, setDropSiteToEdit] = useState<PickUpSite | null>(null)

    const handleCreateMarker = () => {
        setIsMarking(true);
    }

    const [ points, setPoints ] = useState<[number, number][]>([]);
    const [isSettingRoute, setIsSettingRoute] = useState<boolean>(false);

    const lineGeoJSON = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: points
            }
        }]
    }; //: null;


    const handleRouteCreate = (e: MapMouseEvent) => {
        if (!isSettingRoute) return;
        const { lng, lat } = e.lngLat;
        setPoints(prev => [...prev, [lng, lat]]);
    }

    // states for edit route
    const [ openEditRoute, setOpenEditRoute ] = useState<boolean>(false);
    const [routeToEdit, setRouteToEdit ]  = useState<Route|null>(null);

    const sample = (r: Route) => {
        setRouteToEdit(r);
        setOpenEditRoute(true);
    }

    const [driverMarker, setDriverMarker] = useState([0,0]);
    const [isCollectingGarbage, setIsCollectingGarbage] = useState(false);

    useEffect(()=>{
        if (isCollectingGarbage && isDriver) {
            recenter();
            const link =  truck.updateGPS().url;
            router.post(link,
                {
                    truckID: user.truckID,
                    name: user.name,
                    barangay_id: user.residency.barangay_id,
                    lng: driverMarker[0],
                    lat: driverMarker[1],
                },
                        {
                            onSuccess: () => console.log("position updated"),
                            onError: (e) => console.log("error updating location: e")
                        }
            )
        }
    },[isCollectingGarbage, driverMarker]);

    const [watchID, setWatchID] = useState<number|null>(null);

    function recenter(){
        const map = mapRef.current?.getMap();
        map?.flyTo({ center: [ driverMarker[0], driverMarker[1]], zoom: 17, speed: 1})
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                map?.flyTo({ center: [ position.coords.longitude,  position.coords.latitude], zoom: 17, speed: 1})
                setDriverMarker([ position.coords.longitude,  position.coords.latitude]);
                console.log("Updated Latitude:", position.coords.latitude);
                console.log("Updated Longitude:", position.coords.longitude);
            },
            (error) => {
                console.error("Error watching position:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );
        setWatchID(watchId);
    }

    function untrackMe() {
        navigator.geolocation.clearWatch(watchID);
        setWatchID(null);
    }

    const { auth } = usePage().props;

    const [ trucks, setTrucks ] = useState([]);

    const userId = auth?.user?.id;
    // watch notifications from truck updates
    useEffect(() => {
        if (isDriver) return;
        if (!userId) return;
        const channel = window.Echo.channel(`barangay.${user.barangay_official_info?.barangay_id ? user.barangay_official_info.barangay_id : user.residency.barangay_id}`);

        channel.listen(".gps.updated", (data) => {
            let flag = false;
            let index = 0;
            for (let i = 0; i < trucks.length; i++) {
                const truck = trucks[i];
                if (truck.truckID == data.truckID) {
                    flag = true;
                    index = i
                    break;
                }
            }
            const tmp = [...trucks];
            if (flag) {
                tmp[index] = data;
                setTrucks(tmp);
            } else {
                tmp.push(data)
                setTrucks(tmp);
            }
        });

        return () => {
            window.Echo.leave(`barangay-${user.barangay_official_info?.barangay_id ? user.barangay_official_info.barangay_id : user.residency.barangay_id}`);
        };
    }, []);

    function updateStatus(bin_id: number, binStatus: string) {
        router.put(window.location.href,
            {
                status: binStatus,
                bin_id: bin_id
            },
            {
                onError: (e) => console.log("error", e),
                onSuccess: () => console.log("success")
            }
        )
    }

    return <><Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        style={{ borderRadius: 19, height: "100%" }}
        initialViewState={{
            longitude: barangayCoordinates[0], // Malvar default
            latitude: barangayCoordinates[1],
            zoom: zoom,
        }}
        maxBounds={[
            [121.08, 13.93],
            [121.20, 14.10]
        ]}

        onMouseMove={() => {
            const map = mapRef.current?.getMap();
            map.getCanvas().style.cursor = "grab";
            if (!withControls) return;
            if (!isMarking && !isSettingRoute) {
                map.getCanvas().style.cursor = "";
                return;
            }
            map.getCanvas().style.cursor = "url('/resources/MapPinAdd.svg') 8 8, pointer"
        }}
        onClick={(e: MapMouseEvent) => {
            handleRouteCreate(e);
            if (isMarking && withControls) {
                setIsMarking(false);
                setNewPickUpSite({ coordinates: [e.lngLat.lng, e.lngLat.lat] })
                setDrawerOpen(true)
            }
        }}
    >
        <Source type="geojson" data={lineGeoJSON}>
            <Layer
                id="line"
                type="line"
                paint={{
                    'line-color': 'blue',
                    'line-width': 6,
                    'line-opacity': 0.9
                }}
            ></Layer>
        </Source>
        {routes && routes.map((route, index) => <LineRenderer route={route} index={index} map={mapRef.current?.getMap()} onClick={sample} />)}
        /* {routes && <LineRenderer route={routes[0]} map={mapRef.current?.getMap()} />} */
        {dropSites && dropSites.map(dropsite => {
            let status = dropsite?.status ? dropsite?.status[0].status : 'pending';
            try {
                dropsite.coordinates = JSON.parse(dropsite.coordinates);
            } catch {}
            return <Marker key={dropsite.id} longitude={dropsite?.coordinates[0]} latitude={dropsite?.coordinates[1]} anchor="center">
                <Drawer direction="bottom">
                    <DrawerTrigger>
                        <MapPin
                            size={30}
                            className="cursor-pointer p-2 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-2xl bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full ring-2 ring-green-200 dark:ring-green-800"
                        />
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className="overflow-y-scroll" style={{ scrollbarWidth: 'none' }}>
                            <DrawerTitle className="capitalize">
                                <div>{dropsite.bin_name}</div>
                            </DrawerTitle>
                            <DrawerDescription className="flex  flex-col items-center gap-2 justify-center">
                                <Card className="border-current/30">
                                    <CardContent className="max-w-100">
                                        <div className="text-left font-bold">Bin Information</div>
                                        <div className="grid grid-cols-2">
                                            <div className="w-full text-left">BIN ID</div>
                                            <div className="w-full text-left">BIN-{dropsite.id}</div>
                                            <div className="w-full text-left">Status</div>
                                            <div className="w-full text-left">
                                                <div className={cn("text-center px-2 py-1 text-sm font-thin rounded-2xl bg-red-500 text-white", status === 'pending' ? "bg-red-500/60" : status === 'collected' ? "bg-green-500/60" : 'bg-gray-600/60')}>{status}</div>
                                            </div>
                                        </div>
                                        <div className="w-full pt-3 font-bold text-left">Notes</div>
                                        <div className="break-all md:w-[50vw] w-full text-justify">{dropsite.description}</div>
                                    </CardContent>
                                </Card>
                                <div className="flex  flex-col items-center">
                                    <img className="border border-current/30 rounded-xl w-100" src={window.location.origin + '/storage/' + dropsite.image} />
                                </div>
                            </DrawerDescription>

                        </DrawerHeader>
                        <DrawerFooter>
                            <div className="flex justify-center gap-2">
                                {isDriver && <section className="grid grid-cols-2 gap-2">
                                    <Button variant="default" className="col-span-2" onClick={() => {
                                        updateStatus(dropsite.id, 'collected')
                                        status = 'collected';
                                    }}><CircleCheck />Mark As Collected</Button>
                                    <Button variant="outline" onClick={() => {
                                        updateStatus(dropsite.id, 'uncollected');
                                        'uncollected';
                                    }}><SkipForward />Skip</Button>
                                    <Button variant="outline"><TriangleAlert />Report</Button>
                                </section>}
                                {withControls && <Button className="w-fit" onClick={() => {
                                    setDropSiteToEdit(dropsite);
                                    setOpenEdit(true);
                                }}>Edit</Button>}
                                {!isDriver && <DrawerClose>
                                    <Button variant="outline">Close</Button>
                                </DrawerClose>
                                }
                            </div>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Marker>
        })}

        {!isDriver && trucks && trucks.map(truck => <Marker longitude={truck.lng} latitude={truck.lat} anchor="center">
            <Tooltip>
                <TooltipTrigger>
                    <div className="cursor-pointer p-2 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-2xl bg-gradient-to-br from-red-500 to-yellow-600 text-white rounded-full ring-2 ring-green-200 dark:ring-green-800">
                        <Truck className="" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div>TruckID: {truck.truckID}</div>
                    <div>Driver: {truck.name}</div>
                </TooltipContent>
            </Tooltip>
        </Marker>
        )}

        {isDriver && <Marker longitude={driverMarker[0]} latitude={driverMarker[1]} anchor="center">
            <div className="cursor-pointer p-2 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-2xl bg-gradient-to-br from-red-500 to-yellow-600 text-white rounded-full ring-2 ring-green-200 dark:ring-green-800">
                <Truck className="" />
            </div>
        </Marker>
        }
        {newPickUpSite?.coordinates && <Marker onClick={() => setDrawerOpen(true)} longitude={newPickUpSite.coordinates[0]} latitude={newPickUpSite.coordinates[1]} anchor="center">
            <MapPinPlus className="h-10 w-10 bg-red-500 rounded-4xl text-white p-3" />
        </Marker>
        }
        <FullscreenControl />
        <NavigationControl />
        <GeolocateControl />
    </Map>
        {withControls && (
            <section className="flex flex-wrap mt-2 items-center gap-3 p-3 border border-current/30 rounded-md shadow-sm">
                <Button
                    disabled={isSettingRoute | isMarking}
                    onClick={handleCreateMarker}
                    variant="default"
                >
                    Add Pickup Site
                </Button>
                {isMarking && <Button onClick={() => setIsMarking(false)} variant="destructive">
                    Cancel
                </Button>
                }

                {!isSettingRoute && !isMarking && (
                    <Button
                        onClick={() => {
                            setIsSettingRoute(true);
                            setPoints([]);
                        }}
                        variant="secondary"
                    >
                        Add Route
                    </Button>
                )}

                {isSettingRoute && (
                    <div className="flex gap-2 ml-auto">
                        <Button
                            onClick={() => setOpenNewRoute(true)}
                            variant="default"
                        >
                            Save
                        </Button>

                        <Button
                            onClick={() => {
                                const tmp = [...points];
                                tmp.pop();
                                setPoints(tmp);
                            }}
                            variant="outline"
                        >
                            Undo
                        </Button>

                        <Button
                            onClick={() => {
                                setPoints([]);
                                setIsSettingRoute(false);
                            }}
                            variant="destructive"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </section>
        )}

        {
        isDriver == true && <section className="p-2">
            {
                isCollectingGarbage == false ?
                        <Button onClick={() => setIsCollectingGarbage(true)}><Trash2Icon/>Start Garbage Collection</Button>
                :
                <Button  onClick={() => {
                    setIsCollectingGarbage(false);
                    untrackMe();
                    setDriverMarker([0,0]);
                }} variant="destructive"><Trash2Icon/>End Garbage Collection</Button>
            }
            <Button variant="outline" onClick={()=>recenter()}>Recenter</Button>
        </section>
    }

        <Drawer onOpenChange={setDrawerOpen} open={drawerOpen} direction="right">
            <DrawerContent>
                <form onSubmit={submitNewPickUpSite}>
                    <DrawerHeader>
                        <DrawerTitle>New Pick Up Site</DrawerTitle>
                        <DrawerDescription>This action will be visible to all stakeholders. Are you absolutely sure this is accurate?</DrawerDescription>

                        <div>
                            <Label htmlFor="bin_name">Site Name <small>*</small></Label>
                            <Input type="text" onChange={(e) => setNewPickUpSite(prev =>({...prev, "bin_name": e.target.value }))} id="bin_name" name="bin_name" required/>
                        </div>
                        <div>
                            <Label htmlFor="image">Image of the Site <small>optional</small></Label>
                            <Input id="image" name="image" type="file" onChange={e => setNewPickUpSite(prev => ({...prev, "image": e.target.files[0] }))} required/>
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
        <EditDropSite open={openEdit} setOpen={setOpenEdit} pickUpSite={dropSiteToEdit} refreshData={refresh} />
        <CreateRoute open={openNewRoute} setOpen={setOpenNewRoute} pickUpSite={dropSiteToEdit} coordinatesArray={points} setCoordinates={setPoints} refreshData={refresh} />
        <EditRoute open={openEditRoute} setOpen={setOpenEditRoute} route={routeToEdit}  refreshData={refresh} withControls={withControls} />
    </>
}
