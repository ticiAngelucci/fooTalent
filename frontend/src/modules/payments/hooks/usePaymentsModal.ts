import { useState } from "react";

export const usePaymentModal = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = (id: string, name: string, address: string)=>{
        setUserId(id);
        setUserName(name);
        setUserAddress(address);

        setModalOpen(true);
    }


  return{
    userId,
    setUserId,
    userName,
    setUserName,
    userAddress,
    setUserAddress,
    modalOpen,
    setModalOpen,
    handleOpen,
  }

};
