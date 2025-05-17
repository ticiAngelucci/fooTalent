import { useState } from "react";

export const useCancelContractModal = () => {
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleCancel = (id: number) => {
    setCancelId(id);
    setCancelOpen(true);
  };

  return {
    cancelId,
    setCancelId,
    cancelOpen,
    setCancelOpen,
    handleCancel,
  };
};
