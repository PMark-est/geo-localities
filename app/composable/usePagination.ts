export const usePagination = (defaultLimit: number = 10, search: Ref<string>) => {
    const route = useRoute();

    const parseNumber = (value: unknown, fallback: number) => {
        const num = Number(value);
        return !isNaN(num) ? num : fallback;
    }

    const page = ref(parseNumber(route.query.page, 1));
    const limit = ref(parseNumber(route.query.limit, defaultLimit));

    const offset = computed(() => (page.value - 1) * limit.value);


    async function navigate() {
        await navigateTo({
            path: '/',
            query: {
                page: page.value,
                limit: limit.value,
                ...(search.value !== '' && { search: search.value }),
            },
        });
    }

    watch(page, navigate);

    watch(limit, async () => {
        page.value = 1;
        await navigate();
    });

    watch(search, async () => {
        page.value = 1;
        await navigate();
    });

    return {page, limit, offset}
}