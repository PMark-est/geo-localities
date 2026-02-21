import {fetchLocalities} from "~/services/localities";

export const useLocalities = (offset: Ref<number>, limit: Ref<number>) => {
    const { data, pending, error } = useAsyncData(
        'localities',
        () => fetchLocalities(offset.value, limit.value),
        { watch: [offset, limit] }
    );

    return {
        items: computed(() => data.value?.results ?? []),
        total: computed(() => data.value?.count ?? 0),
        pending,
        error
    };
};