const SummaryCard = ({ label, value, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow-none p-4 flex flex-col items-start text-center border border-zinc-200 w-full max-w-[70%]">
            <div className="flex flex-row justify-between items-center w-full text-black text-sm  mb-2">
                {label}
                {icon && <span>{icon}</span>}
            </div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
};

export default SummaryCard;
