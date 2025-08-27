import { useCategoriesQuery } from "../generated/graphql";

export function useCategoryOptions() {
    const { data } = useCategoriesQuery();
    return (data?.categories ?? []).map(cat => ({ label: cat.name, value: cat.id }));
}
