import React, { useEffect, useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import barangay from '@/routes/barangay';
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  auth: {
    user: {
      id: number;
      name: string;
      residency: {
        barangay_id: number;
        barangay: {
            name: string;
        };
      };
    };
  };
    userRatingThisWeek?: boolean; // true if already rated this week
};

export default function Submit({ auth, userRatingThisWeek }: Props) {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const { barangay_id } = usePage().props.auth.user.residency;
    const form = useForm({
        barangay_id: barangay_id,
        rating: selectedRating
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedRating < 1) {
            alert('Please select a rating.');
            return;
        }
        console.log(form);
        router.post(barangay.ratings.store().url, {
            barangay_id: barangay_id,
            rating: selectedRating
        },
            {
                onSuccess: () => {
                    setSelectedRating(0);
                    setOpen(false);
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
    };

    const barangayName = auth.user.residency.barangay.name;
    const [ open, setOpen ] = useState(!userRatingThisWeek);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
            <DialogTitle>Every Feedback Counts!</DialogTitle>
            <DialogDescription>
                Barangay: {barangayName}
            </DialogDescription>
            <DialogTitle>Rate Your Barangay</DialogTitle>
                {userRatingThisWeek ? (
                    <p className="text-green-600 font-semibold">
                        You have already submitted a rating this week.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="mb-4 flex items-center justify-center flex-col">
                        {/* Star rating */}
                        <div className="mb-4 flex items-center justify-center flex-col">
                            <label className="block font-medium mb-2">Rating</label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => {
                                            setSelectedRating(star)
                                        }
                                        }
                                        className={`text-4xl ${selectedRating >= star ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
