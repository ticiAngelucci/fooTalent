import { Check } from 'lucide-react'

interface ToastProps {
    title: string;
    description: string;
}

const SuccessToast = ({ title, description }: ToastProps) => {
    return (
        <div className="bg-green-50 border border-green-600/20 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-green-700 font-semibold text-sm flex gap-2 items-center">
                <Check />{title}
            </p>
            <p className="text-gray-700 text-sm mt-1">
                {description}
            </p>
        </div>
    )
}

export default SuccessToast