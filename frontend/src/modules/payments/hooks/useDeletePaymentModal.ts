import { useState } from "react";

export const useDeletePaymentModal = () => {
  const [deleteId, setDeleteId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = (id: string)=>{
        setDeleteId(id);
        setDeleteOpen(true);
    }


  return{
    deleteId,
    setDeleteId,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
  }

};
