import FormCreateSubtestTryout from "@/components/molecules/form/subtest/FormCreateSubtestTryout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogCreateSubtestTryoutProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tryoutId: string;
  examType: "utbk" | "cpns";
}

export default function DialogCreateSubtestTryout({
  open,
  setOpen,
  tryoutId,
  examType,
}: DialogCreateSubtestTryoutProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl overflow-visible">
        <DialogHeader>
          <DialogTitle>Tambah Subtes ke Tryout</DialogTitle>
        </DialogHeader>
        <FormCreateSubtestTryout
          tryoutId={tryoutId}
          examType={examType}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
