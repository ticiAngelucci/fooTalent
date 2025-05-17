import { cn } from "@/lib/utils"; 

const Spinner = ({ className = "" }: { className?: string }) => (
  <div className={cn("animate-spin rounded-full border-t-2 border-b-2 border-white w-5 h-5", className)} />
);

export default Spinner;