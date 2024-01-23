import {axiosInstance} from "@/app/interceptor.tsx";
import s from "@/shared/components/AddressForm/AddressForm.module.scss";
import Select from "react-select";
import React, {useEffect} from "react";

export interface IChainItem {
    objectId: string;
    objectGuid: string;
    text: string;
    objectLevel: string;
    objectLevelText: string | null;
}

export interface IAddressFormProps {
    parenAddress?: IChainItem;
    onEdit: (address?: IChainItem, index: number) => void;
    index: number;
}

const AddressItem = ({parenAddress, onEdit, index}: IAddressFormProps) => {
    const [tempAddresses, setTempAddresses] = React.useState<IChainItem[]>([]);
    const [formattedAddress, setFormattedAddress] = React.useState<string>("");
    const [currentAddress, setCurrentAddress] = React.useState<IChainItem | undefined>(undefined);
    const [isHaveAddress, setIsHaveAddress] = React.useState<boolean>(false);

    useEffect(() => {
        setIsHaveAddress(false);
        setCurrentAddress(undefined);
        setFormattedAddress("");
        setTempAddresses([]);
        const fetchData = async () => {
            const startItem = await fetchAddresses(parenAddress?.objectId, undefined);
            setIsHaveAddress(startItem.length > 0);
            setTempAddresses(startItem);
        }
        fetchData();
    }, [parenAddress]);

    useEffect(() => {
        setFormattedAddress(formatTypeAddresses(tempAddresses));
    }, [tempAddresses]);

    const formatTypeAddresses = (addresses: IChainItem[]): string => {
        const uniqueAddresses = addresses.filter((address, index, self) =>
                index === self.findIndex((t) => (
                    t.objectLevelText === address.objectLevelText
                ))
        )
        let result = "Выберите: ";
        uniqueAddresses.forEach((address) => {
            result += `${address.objectLevelText}, `;
        });
        return result.slice(0, -2);
    };

    const fetchAddresses = async (objectId?: string, text?: string) => {
        const encodedText = encodeURIComponent(text || "");
        const response = await axiosInstance
            .get <IChainItem[]>(`address/search?parentObjectId=${objectId}&query=${encodedText}`);
        return response.data;
    };

    const handleInputChange = (newValue: string) => {
        fetchAddresses(parenAddress?.objectId, newValue).then((data) => {
            setTempAddresses(data);
        });
    };

    return (
        <div>
            {isHaveAddress && (
                <div key={parenAddress?.objectId} className={s.formItem}>
                    <label htmlFor={`level${parenAddress?.objectId}`}>
                        {currentAddress ? currentAddress.objectLevelText : formattedAddress}
                    </label>

                    <Select
                        className={s.select}
                        id={`level${parenAddress?.objectId}`}
                        name={`level${parenAddress?.objectId}`}
                        options={tempAddresses.map((address) => ({
                            value: address.objectId,
                            label: address.text,
                        }))}
                        onChange={(item) => {
                            const selectedObjectId = item?.value;
                            const valueAddress = tempAddresses
                                .find((field) => field.objectId === selectedObjectId);
                            setCurrentAddress(valueAddress);
                            onEdit(valueAddress, index);
                        }}
                        onInputChange={(inputValue, {action}) => {
                            if (action === 'input-change') {
                                handleInputChange(inputValue);
                            }
                            if (action === 'menu-close') {
                                handleInputChange("");
                            }
                        }}
                        value={
                            currentAddress ? {
                                value: currentAddress.objectId,
                                label: currentAddress.text,
                            } : null
                        }
                    />
                </div>
            )}
        </div>
    )
}

export default AddressItem;