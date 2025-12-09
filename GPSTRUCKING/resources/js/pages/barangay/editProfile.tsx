import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ChevronsUpDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { useState } from "react";
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
import { Edit } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/barangay/app-layout'
import barangay, { barangayProfileForm, submitBarangayProfileForm } from '@/routes/barangay';
import resident from '@/routes/resident';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, FormEventHandler } from 'react';
import { Barangay } from './profileForm';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, FileText, CreditCard } from 'lucide-react';
import profile from "@/routes/profile";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Barangay Official Profile',
        href: barangay.profile().url
    }
];

export interface BarangayOfficialInformation {
    'barangay_official_id'?: string,
    'proof_of_identity'?: string,
    'contact_number'?: string,
    'email'?: string,
    'barangay_id'?: number,
    'barangay': Barangay,
}

export interface User {
    email: string;
    id: number;
    name: string;
    barangay_official_info: BarangayOfficialInformation;
}


export function EditBarangayAssignment({ barangay: barangayName, barangays } : { barangay: string, barangays : Barangay[]}) {
    const barangay_id : number = usePage().props.auth.user.barangay_official_info.barangay_id;
    const { data, setData, put, processing, errors } = useForm({
        'barangay_id': barangay_id,
        'barangay': barangayName,
    });


    function submitForm(e: FormEvent) {
        if (!e.target.checkValidity()){
            return;
        }
        e.preventDefault();
        put(barangay.assignment.update().url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.info("Updated barangay assignment", {
                    description: "Your account may need to be verified before being used again.",
                })
                setFormOpen(false)
            }
        });
    }

    const [open, setOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
  return (
    <Dialog onOpenChange={setFormOpen} open={formOpen}>

        <DialogTrigger asChild>
          <Edit className="cursor-pointer"/>
        </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={submitForm}>
                  <DialogHeader>
                      <DialogTitle>Barangay Assignment</DialogTitle>
                      <DialogDescription>
                          Make changes to your barangay information here. Click save when you&apos;re
                          done.
                          <Alert variant="destructive">
                              <AlertCircleIcon />
                              <AlertTitle>Changing your assignment will cause reevaluation.</AlertTitle>
                              <AlertDescription>
                                  <p>If you update your assignment, your account will be reevaluated by our admin. Administrative controls will temporarily be unavailable.</p>
                              </AlertDescription>
                          </Alert>
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-2">
                      <div className="grid gap-3">
                          <Label htmlFor="contact_number">Barangay</Label>
                          <div className="space-y-2">
                              <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger className="w-full flex justify-between items-center border px-3 py-2 rounded-lg dark:bg-neutral-800 dark:text-white">
                                {data.barangay || "Select Barangay"}
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </PopoverTrigger>

                            <PopoverContent className="p-2 w-[250px]">
                                <Command>
                                    <CommandInput placeholder="Search barangay (Limited to Malvar batangas)..." />
                                    <CommandGroup className="max-h-[30vh] overflow-y-auto">
                                        {barangays.map((brgy, index) => (
                                            <CommandItem
                                                key={index}
                                                onMouseDown={() => {
                                                    setData("barangay", brgy.name);
                                                    setData("barangay_id", brgy.id);
                                                    console.log("selected", data);
                                                }}
                                                onSelect={() => {
                                                    setOpen(false);
                                                }}
                                            >
                                                {brgy.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        { errors.barangay_id && <div className="text-red-500">{errors.barangay_id}</div> }
                    </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
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


export function EditContactInformation({ user } : {user : User}) {
    const { data, setData, put, processing, errors } = useForm({
        'contact_number': user.barangay_official_info.contact_number,
        'email': user.barangay_official_info.email
    });

    const [formOpen, setFormOpen] = useState(false);

    function submitForm(e: FormEvent) {
        if (!e.target.checkValidity()){
            return;
        }
        e.preventDefault();
        put(barangay.contact.update().url,
           {
            preserveScroll: true,
            onSuccess: () => {
                toast.info("Updated contact information", {})
                setFormOpen(false)
            }
        });
    }

  return (
    <Dialog onOpenChange={setFormOpen} open={formOpen}>
        <DialogTrigger asChild>
          <Edit className="cursor-pointer"/>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={submitForm}>
          <DialogHeader>
            <DialogTitle>Edit contact information</DialogTitle>
            <DialogDescription>
              Make changes to your contact information here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="contact_number">Contact Number</Label>
                <Input onChange={(e) => setData('contact_number', e.target.value)} id="contact_number" name="contact_number" defaultValue={user.barangay_official_info.contact_number} pattern="[0-9]{11}" maxLength={11} required/>
                { errors.contact_number && <div className="text-red-500">{errors.contact_number}</div> }

            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Barangay Email</Label>
              <Input onChange={(e) => setData('email', e.target.value)} id="email" name="email" defaultValue={user.barangay_official_info.email} required />
          { errors.email && <div className="text-red-500">{errors.email}</div> }
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


export function EditFiles({ user } : {user : User}) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        'barangay_official_id': user.barangay_official_info.barangay_official_id,
        'proof_of_identity': user.barangay_official_info.proof_of_identity,
    });


    function submitProof(e:FormEvent) {
        if (!e.target.checkValidity()){
            return;
        }
        e.preventDefault();
        post(barangay.validId.update().url,
           {
               preserveScroll: true,
            onSuccess: () => {
                toast.info("Updated Valid ID", {
                    description: "Your account may need to be verified before being used again.",
                })
                setFormOpen(false)
            }
        });
    }
    const [formOpen, setFormOpen] = useState(false);

    function submitBarangayID(e:FormEvent) {
        if (!e.target.checkValidity()){
            return;
        }
        e.preventDefault();
        post(barangay.officialId.update().url, {
            preserveScroll: true,
            onSuccess: () => {
                toast.info("Updated Barangay ID", {
                    description: "Your account may need to be verified before being used again.",
                })
                setFormOpen(false)
            }
        });
    }

  return (
      <Dialog onOpenChange={setFormOpen} open={formOpen}>
        <DialogTrigger asChild>
          <Edit className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Replace Documents</DialogTitle>
            <DialogDescription>
              Make changes to your documents here. Upload files and it will automatically be replaced.
          <Alert variant="destructive">
                              <AlertCircleIcon />
                              <AlertTitle>Changing documents will cause reevaluation.</AlertTitle>
                              <AlertDescription>
                                  <p>If you update your document, your account will be reevaluated by our admin. Administrative controls will temporarily be unavailable.</p>
                              </AlertDescription>
                          </Alert>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 pt-2">
            <form onSubmit={submitBarangayID} className="grid gap-3">
              <Label htmlFor="contact_number">Official Barangay ID</Label>
              <Input type="file" onChange={(e) => {setData('barangay_official_id', e.target.files[0])}} id="contact_number" name="contact_number" required />
                { errors.barangay_official_id && <div className="text-red-500">{errors.barangay_official_id}</div> }
              <Button disabled={processing} type="submit">{processing && <Spinner />}Save</Button>
            </form>
                  <form onSubmit={submitProof} className="grid gap-3">
              <Label htmlFor="proof_of_identity">Valid ID</Label>
              <Input type="file" onChange={(e) => {
                  setData('proof_of_identity', e.target.files[0])
              }} id="proof_of_identity" name="proof_of_identity" required />
                { errors.proof_of_identity && <div className="text-red-500">{errors.proof_of_identity}</div> }
              <Button disabled={processing} type="submit">{processing && <Spinner />}Save</Button>
            </form>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}



export default function editProfile({ barangay, barangays }: {
    barangay: Barangay;
    barangays: Barangay[];
}) {
    const user: User = usePage().props.auth.user;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barangay Personel Dashboard" />
            <main className="min-h-screen p-4 md:p-8 transition-colors duration-300">
                <div className="max-w-4xl mx-auto">
                    {/* Header Card */}
                    <div className="bg-white/30 dark:bg-black rounded-3xl shadow-lg overflow-hidden mb-6 transition-colors duration-300">
                        <div className="bg-gradient-to-r from-green-600 to-green-800 dark:from-green-600 dark:to-green-800 px-8 py-6">
                            <h1 className="text-3xl font-bold text-white">Barangay Official Profile</h1>
                            <p className="text-green-100 dark:text-green-200 mt-1">
                                Official Information and Documents
                            </p>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Personal Information Card */}
                        <div className="bg-white/30 dark:bg-gray-900/30 rounded-2xl shadow-lg p-6 space-y-5 transition-colors duration-300">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex justify-between w-full items-center">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Details</h2>
                                    <Link href={profile.edit().url}>
                                        <Edit />
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Username</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium mt-1">{user.name}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Login Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Card */}
                        <div className="bg-white/30 dark:bg-gray-900/30 rounded-2xl shadow-lg p-6 space-y-5 transition-colors duration-300">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                    <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h2>
                                    <EditContactInformation user={user}/>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact Number</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {user.barangay_official_info.contact_number}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Barangay Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <p className="text-gray-900 dark:text-gray-100">
                                            {user.barangay_official_info.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Barangay Assignment Card */}
                        <div className="bg-white/30 dark:bg-gray-900/30 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            <div className="flex justify-between items-center w-full">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Assignment</h2>
                                <EditBarangayAssignment barangay={barangay.name} barangays={barangays}/>
                            </div>
                            </div>

                            <div className="mt-5">
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Barangay Official Of</label>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{(barangay.name)}</p>
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="bg-white/30 dark:bg-gray-900/30 rounded-2xl shadow-lg p-6 transition-colors duration-300">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Official Documents</h2>
                                    <EditFiles user={user}/>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                <a
                                    href={'/storage/' + user.barangay_official_info.barangay_official_id}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-indigo-50 dark:from-green-900/30 dark:to-indigo-900/30 rounded-xl hover:shadow-md dark:hover:from-green-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/70 transition-colors">
                                        <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Official Barangay ID</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Click to view document
                                        </p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>

                                <a
                                    href={'/storage/' + user.barangay_official_info.proof_of_identity}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl hover:shadow-md dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-200 group"
                                >
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/70 transition-colors">
                                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Valid ID</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Click to view document
                                        </p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>);
}
