import {type Locality, LocalitySchema} from "~/interfaces/locality.interface";
import {type LocalitiesResponse, LocalitiesResponseSchema} from "~/interfaces/localities-response.interface";

export const fetchLocalities = async (offset: number, limit: number, search?: string): Promise<LocalitiesResponse> => {
    const data = await $fetch(`https://rwapi.geoloogia.info/api/v1/public/localities/`, {
        query: {
            offset,
            limit,
            name__icontains: search || undefined,
        }
    });
    return LocalitiesResponseSchema.parse(data);
}

export const fetchLocality = async (id: number | string): Promise<Locality> => {
    const data = await $fetch(`https://rwapi.geoloogia.info/api/v1/public/localities/${id}`);
    return LocalitySchema.parse(data);
}
