import type {Locality} from "~/interfaces/locality.interface";

export const fetchLocalities = (offset: number, limit: number) => {
    return $fetch(`https://rwapi.geoloogia.info/api/v1/public/localities/`, {
        query: { offset, limit }
    })
}

export const fetchLocality = async (id: number | string) => {
    const {data: localities} = await useFetch(`https://rwapi.geoloogia.info/api/v1/public/localities/${id}`);
    return localities.value as Locality;
}
