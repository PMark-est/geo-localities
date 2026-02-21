export const usePagination = (defaultLimit: number = 10) => {
    const route = useRoute();

    const parseNumber = (value: unknown, fallback: number) => {
        const num = Number(value);
        return !isNaN(num) ? num : fallback;
    }

    const page = ref(parseNumber(route.query.page, 1));
    const limit = ref(parseNumber(route.query.limit, defaultLimit));

    const offset = computed(() => (page.value - 1) * limit.value);


    watch(page, async () => {
        await navigateTo({
            path: "/",
            query: {
                page: page.value,
                limit: limit.value,
            }
        })
    })

    watch(limit, async () => {
        page.value = 1;
        await navigateTo({
            path: "/",
            query: {
                page: page.value,
                limit: limit.value,
            }
        })
    })

    return { page, limit, offset }
}