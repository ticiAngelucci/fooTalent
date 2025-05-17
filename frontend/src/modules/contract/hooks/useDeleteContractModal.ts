import { useState } from "react";

export const useDeleteContractModal = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  return {
    deleteId,
    setDeleteId,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
  };
};
