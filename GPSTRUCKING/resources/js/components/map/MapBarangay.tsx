import { FullscreenControl, Layer, MapMouseEvent, MapRef, Source } from "@vis.gl/react-maplibre"
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
import { MapPin, MapPinPlus, Pickaxe, Route } from "lucide-react";
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

export interface PickUpSite {
    id?: number;
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

// TODO ROUTES!!!!
// manually add routes by hand

export default function MapBarangay({ barangayCoordinates, withControls = false }: {
    barangayCoordinates: [number, number],
    withControls?: boolean
}) {

    const mapRef = useRef<MapRef | null>(null);
    const map = mapRef.current?.getMap();
    const user = usePage().props.auth.user;

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
        fetch(`${window.location.origin}${get.routes().url}`)
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
            const map = mapRef.current?.getMap();
            map.getCanvas().style.cursor = "grab";
            if (!withControls) return;
            if (!isMarking && !isSettingRoute) {
                map.getCanvas().style.cursor = "";
                return;
            }
            map.getCanvas().style.cursor = "url('/resources/MapPinAdd.svg') 8 8, pointer"
        }}
        onClick={(e:MapMouseEvent) => {
            handleRouteCreate(e);
            if (isMarking && withControls) {
                setIsMarking(false);
                setNewPickUpSite({ coordinates: [e.lngLat.lng, e.lngLat.lat ] })
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
                    <DrawerHeader>
                        <DrawerTitle>Pick Up Site Information</DrawerTitle>
                        <DrawerDescription className="flex flex-col items-center gap-2 justify-center">
                            <div className="break-all md:w-[50vw] w-full text-justify">{dropsite.description}</div>
                            <img className="w-[50vh]" src={window.location.origin + '/storage/' + dropsite.image} />
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
        <FullscreenControl/>
        <NavigationControl/>
        <GeolocateControl/>
    </Map>
        {withControls && (
            <section className="flex flex-wrap items-center gap-3 p-3 border border-gray-200/80 rounded-md shadow-sm">
                <Button
                    disabled={isSettingRoute|isMarking}
                    onClick={handleCreateMarker}
                    variant="default"
                >
                    Add Pickup Site
                </Button>
                { isMarking && <Button onClick={() => setIsMarking(false)} variant="destructive">
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

        <Drawer onOpenChange={setDrawerOpen} open={drawerOpen} direction="right">
            <DrawerContent>
                <form onSubmit={submitNewPickUpSite}>
                    <DrawerHeader>
                        <DrawerTitle>New Pick Up Site</DrawerTitle>
                        <DrawerDescription>This action will be visible to all stakeholders. Are you absolutely sure this is accurate?</DrawerDescription>

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
