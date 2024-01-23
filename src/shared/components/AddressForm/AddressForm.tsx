import React, {useEffect, useState} from "react";
import s from "./AddressForm.module.scss";
import AddressItem, {IChainItem} from "@/shared/components/AddressForm/AddressItem.tsx";

const AddressForm = ({onGUIDChange}) => {
    const [addressChain, setAddressChain] = useState<(IChainItem | undefined)[]>([]);

    useEffect(() => {
        setAddressChain([{objectId: "0", objectGuid: "", text: "", objectLevel: "", objectLevelText: ""}]);
    }, []);

    const onEdit = (address: IChainItem | undefined, index: number) => {
        if (address) {
            const newAddressChain = addressChain.slice(0, index + 1);
            newAddressChain.push(address);
            onGUIDChange(address.objectGuid);
            setAddressChain(newAddressChain);
        }
    };

    return (
        <div className={s.addressChain}>
            <h3>Изменить адрес</h3>
            {addressChain.map((chain, index) => (
                <AddressItem
                    parenAddress={chain}
                    onEdit={onEdit}
                    index={index}
                />
            ))}
        </div>
    )
};

export default AddressForm;
