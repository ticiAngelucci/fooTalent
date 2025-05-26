import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Check, X } from "lucide-react"

interface ModalContent {
  title: string
  subtitle: string
  items: string[]
}

interface ModalLegalProps {
  open: boolean
  onClose: () => void
  content: ModalContent
}

export const ModalLegal = ({ open, onClose, content }: ModalLegalProps) => {
    return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg flex flex-col items-start overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-black">{content.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-4">
          <p className="text-sm text-[#4B5563] mb-4">{content.subtitle}</p>
          <ul className="list-disc pl-4 space-y-2 text-sm text-[#4B5563]">
            {content.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-red-50"
          >
            <X className="w-5 h-5" />
            Rechazar
          </Button>
          <Button
            onClick={onClose}
            className="flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1B3B9D]"
          >
            <Check className="w-5 h-5 text-white" />
            Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
