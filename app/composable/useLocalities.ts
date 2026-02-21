import {fetchLocalities} from "~/services/localities";

export const useLocalities = (offset: Ref<number>, limit: Ref<number>, search:Ref<string>) => {
    const { data, pending, error } = useAsyncData(
        'localities',
        () => fetchLocalities(offset.value, limit.value, search.value),
        { watch: [offset, limit, search] }
    );

    return {
        items: computed(() => data.value?.results ?? []),
        total: computed(() => data.value?.count ?? 0),
        pending,
        error
    };
};