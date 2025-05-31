import { CircleAlert } from "lucide-react";

interface ToastProps {
    title: string;
    description: string;
}

const ErrorToast = ({ title, description }: ToastProps) => {
    return (
        <div className="bg-error-50 border border-error-700 rounded-md p-4 w-[360px] shadow-md">
            <p className="text-error-700 font-semibold text-sm flex gap-2 items-center">
                <CircleAlert />{title}
            </p>
            <p className="text-neutral-600 text-sm mt-1">
                {description}
            </p>
        </div>
    )
}

export default ErrorToast