import {useFetch} from "nuxt/app";
import type {Locality} from "~/interfaces/locality.interface";

export const useLocalities = async () => {
    const {data: localities} = await useFetch("https://rwapi.geoloogia.info/api/v1/public/localities");
    return localities.value;
}

export const useLocality = async (id: number | string) => {
    const {data: localities} = await useFetch(`https://rwapi.geoloogia.info/api/v1/public/localities/${id}`);
    return localities.value as Locality;
}