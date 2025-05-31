import { Check } from 'lucide-react'

interface ToastProps {
    title: string;
    description: string;
}

const SuccessToast = ({ title, description }: ToastProps) => {
    return (
        <div className="bg-success-50 border border-success-700 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-success-700 font-semibold text-sm flex gap-2 items-center">
                <Check />{title}
            </p>
            <p className="text-neutral-600 text-sm mt-1">
                {description}
            </p>
        </div>
    )
}

export default SuccessToast