import {useFetch} from "nuxt/app";

export const useLocalities = async () => {
    const {data: localities} = await useFetch("https://rwapi.geoloogia.info/api/v1/public/localities");
    return localities.value;
}