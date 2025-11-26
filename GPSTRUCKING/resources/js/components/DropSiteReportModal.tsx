import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import dropSiteReports from '@/routes/drop-site-reports';

interface Props {
  dropSiteId: number;
}

export function DropSiteReportModal({ dropSiteId }: Props) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    drop_site_id: dropSiteId,
    description: "",
  });

  const submit = () => {
      post(dropSiteReports.store().url, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Report Drop Site</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Drop Site</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <label className="text-sm font-medium">Describe the issue</label>
          <Textarea
            rows={4}
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            placeholder="Explain the problem or concern..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={processing}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
