import { JSX } from "react";

interface Props {
    label: string;
    value:number;
    icon: JSX.Element;
    borderClass: string;
}
const SummaryCard = ({label, value, icon, borderClass}: Props) => {
    return (
        <div className={`bg-transparent rounded-md shadow-none p-4 flex flex-col items-start text-center border ${borderClass} w-full`}>
            <div className="flex flex-row gap-8 gap-2.5 items-center w-full text-black text-sm">
                {icon}
                <div className="flex flex-col justify-center items-start text-neutral-950">
                    <p className="text-5xl font-semibold">{value}</p>
                    <span className="text-base">{label}</span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
