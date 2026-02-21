import { ref, computed } from 'vue'
import { refDebounced } from "@vueuse/core";

export const useSearch = () => {
    const route = useRoute();

    const sanitize = (val: string) => val.replace(/[<>/]/g, '').trimStart();

    const searchInput = ref("");

    if (route.query.search?.toString() !== undefined){
        searchInput.value = sanitize(route.query.search.toString());
    }

    watch(searchInput, (value) => {
        // prevent xss by not allowing the following characters: <>/
        searchInput.value = sanitize(value);
    })

    const debouncedSearch = refDebounced(searchInput, 400);

    return { searchInput, debouncedSearch };
}