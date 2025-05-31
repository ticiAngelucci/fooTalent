import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import NewPaymentForm from "../components/NewPaymentForm";

interface PaymentProps {
    id: string;
    userName: string;    
    address: string;
    ammount?:number;
    paymentId?: number;
    open: boolean;
    setOpen: (value: boolean) => void;
    loadPayments: () => Promise<void>;
}

const PaymentRegister = ({ id,userName, address, ammount, paymentId, open, setOpen, loadPayments }: PaymentProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="">
                <DialogTitle>
                    Registrar Pago
                </DialogTitle>
                <DialogDescription>
                    Ingresa los datos Solicitados
                </DialogDescription>
                <DialogHeader className="flex-row gap-8 items-center">
                    <div className="flex flex-col flex-1/2 gap-2.5">
                        <label className="text-base text-neutral-950 font-semibold">Nombre del titular</label>
                        <span className="w-full py-2 px-3 rounded-sm border text-base border-neutral-300 bg-neutral-100">{userName}</span>
                    </div>
                    <div className="flex flex-col flex-1/2 gap-2.5 truncate">
                        <label className="text-base text-neutral-950 font-semibold">Dirección</label>
                        <span className="w-full py-2 px-3 rounded-sm border text-base border-neutral-300 bg-neutral-100 truncate">{address}</span>
                    </div>
                </DialogHeader>
                <NewPaymentForm id={id} setOpen={setOpen} ammount={ammount} paymentId={paymentId} loadPayments={loadPayments}/>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentRegister