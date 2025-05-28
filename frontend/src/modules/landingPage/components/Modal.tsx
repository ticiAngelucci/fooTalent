import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { ScrollArea } from "@/shared/components/ui/scroll-area"

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
      </DialogContent>
    </Dialog>
  )
}
