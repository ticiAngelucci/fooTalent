import { useState } from "react";

export const usePaymentModal = () => {
  const [userId, setUserId] = useState("");
  const [paymentId, setPaymentId] = useState<number>();
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [ammount, setAmmount ] = useState<number>();
  const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = (id: string, name: string, address: string, ammount?:number, paymentId?: number)=>{
        setUserId(id);
        setPaymentId(paymentId);
        setUserName(name);
        setUserAddress(address);
        setAmmount(ammount)
        setModalOpen(true);
    }


  return{
    userId,
    paymentId,
    setUserId,
    userName,
    setUserName,
    userAddress,
    ammount,
    setUserAddress,
    modalOpen,
    setModalOpen,
    handleOpen,
  }

};
