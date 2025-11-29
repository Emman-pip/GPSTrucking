import { Button } from '@/components/ui/button';

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
import { useState } from "react";
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown, Dot, Edit, Link2, Plus, Trash, Truck, User, User2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { individualChat } from '@/routes';
import { UserInfo } from '@/components/user-info';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Drivers and Trucks',
        href: '#'
    }
];


function CreateNewTruckForm() {
    const { data, setData, post, errors, processing } = useForm({
        'name': '',
        'truckID': '',
    });

    const [ open, setOpen ] = useState<boolean>(false);


    const handleSubmit = (e) => {
        if (!e.target.checkValidity()) {
            return;
        }
        e.preventDefault();
        post(barangay.drivers.post().url, {
            onSuccess: () => {
                setOpen(false);
                toast.info(`Driver ${data.name} successfully created`)
            },
        }); // your route here
    };

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                    <Button className="flex gap-1"><Plus/>Add Truck/Driver</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>

                    <DialogHeader>
                        <DialogTitle>Create New Truck/Driver</DialogTitle>
                        <DialogDescription>
                            This is a form to create new trucks with assigned drivers
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="driver name..." onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <span className='text-red-500'>{errors.name}</span> }
                        </div>
                        <div className="grid gap-3 pb-2">
                            <Label htmlFor="truckID">Truck ID<span className="text-red-500">*</span> </Label>
                            <Input id="truckID" name="truckID" placeholder="plate number, identification code, etc" onChange={(e) => setData('truckID', e.target.value)} required />
                            { errors.truckID && <span className='text-red-500'>{errors.truckID}</span> }
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


function EditNewTruckForm({ name, truckID, id } : { name:string, truckID:string, id:number }) {
    const { data, setData, put, errors, processing } = useForm({
        'name': name,
        'truckID': truckID,
        'id': id,
    });

    const [ open, setOpen ] = useState<boolean>(false);


    const handleSubmit = (e) => {
        if (!e.target.checkValidity()) {
            return;
        }
        e.preventDefault();
        put(barangay.drivers.put().url, {
            onSuccess: () => setOpen(false),
        }); // your route here
    };

    const handleDelete = (id:number) => {
        router.delete(barangay.drivers.delete(id).url, {
            onSuccess: ()=>{
                router.get('#')
            }

        });
    }

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="w-full"><Edit></Edit>Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>

                    <DialogHeader>
                        <DialogTitle>Edit New Truck/Driver</DialogTitle>
                        <DialogDescription>
                            This is a form to edit trucks with assigned drivers
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="driver name..." defaultValue={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <span className='text-red-500'>{errors.name}</span> }
                        </div>
                        <div className="grid gap-3 mb-2">
                            <Label htmlFor="truckID">Truck ID</Label>
                            <Input id="truckID" name="truckID" placeholder="plate number, identification code, etc" defaultValue={data.truckID} onChange={(e) => setData('truckID', e.target.value)} required />
                            { errors.truckID && <span className='text-red-500'>{errors.truckID}</span> }
                        </div>
                    </div>
                    <DialogFooter className="flex items-center">
                        <Trash className="text-red-500/30 hover:text-red-500/80" onClick={() => handleDelete(data.id)}/>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button>Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function generateLink(name: string, truckID: string, hours: number) {
    fetch(barangay.generate.driver().url + '?name=' + name + '&truckID=' + truckID + '&hours=' + hours)
        .then((e) => e.text())
        .then(e => {
            navigator.clipboard.writeText(e);
            alert('copied to clipboard');
        });
}

function GenerateLinkForm({ name, truckID} :
                          {name:string; truckID:string}) {

    const [ open, setOpen ] = useState<boolean>(false);
    console.log(name, truckID)
    const [ data, setData ] = useState({
        name: name,
        truckID: truckID,
        hours: 12,
    });


    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                    <Button className="flex w-full gap-1"><Link2/>Generate Link</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">

                    <DialogHeader>
                        <DialogTitle>Generate Access Link</DialogTitle>
                        <DialogDescription>
                            This is a access link generation for {name} (truck ID: {truckID})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="hours">Time to expire (in hours)</Label>
                        <Input type="number" id="hours" name="hours" defaultValue={data.hours} onChange={(e) => setData({'hours': e.target.value})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={()=>generateLink(name, truckID, data.hours)}>Generate</Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export interface  TruckAndDriver {
    barangayID: number,
    name: string,
    truckID: string
    id: number,
}

export default function Drivers({ truckData } : {
    truckData: TruckAndDriver[]
}) {
    const { user } = usePage().props.auth;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Drivers and Trucks" />
            <main className="p-2">
                <section className="flex justify-between items-center pb-2 flex-wrap">
                    <div className="">
                        <div className="text-xl font-bold">Drivers and Trucks</div>
                        <small>Manage your fleet and personnel</small>
                    </div>
                    <CreateNewTruckForm />
                </section>
                <section className={ cn("grid grid-cols-1 ", truckData?.length > 0 ? "sm:grid-cols-2 lg:grid-cols-3 gap-2" : "" ) }>
                    {truckData && truckData?.length ?
                     truckData.map((truck, index) => {
                         return <Card className="p-2 border-current/30 gap-2" key={'truck-' + index}>
                             <CardTitle className="flex gap-2 items-center">
                                 <div className="bg-gray-500/30 p-2 rounded-2xl">
                                     <Truck/>
                                 </div>
                                 {truck.truckID}
                             </CardTitle>
                            <CardDescription>
                                <div className=" border-b border-current/30 flex gap-2 items-center p-2"><User size={13}/>{truck.name}</div>
                                <div className="p-3 flex gap-1 flex-wrap ">
                                    <EditNewTruckForm  name={truck.name} truckID={truck.truckID} id={truck.id} />
                                     <GenerateLinkForm name={truck.name} truckID={truck.truckID} />
                                </div>
                            </CardDescription>
                        </Card>
                     })
                      : <Card className="border-current/30">
                          <CardTitle className="p-2">No truck or driver data yet. Create one!</CardTitle>
                      </Card>
                    }
                </section>
            </main>
        </AppLayout>
    );
}
