import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "@/shared/constants/url.ts";

export const useFullAddress = (addressGUID: string | null) => {
    const [fullAddress, setFullAddress] = useState<string>("");

    useEffect(() => {
        const fetchAddressChain = async () => {
            try {
                if (addressGUID) {
                    const response = await axios.get(
                        `${BASE_URL}address/chain?objectGuid=${addressGUID}`
                    );
                    if (response.data) {
                        const addressChain = response.data.map(
                            (addressObj) => addressObj.text
                        );
                        const formattedAddress = addressChain.join(", ");
                        setFullAddress(formattedAddress);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch address chain:", error);
            }
        };
        fetchAddressChain();
    }, [addressGUID]);

    return fullAddress;
};
