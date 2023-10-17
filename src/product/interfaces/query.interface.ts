export interface IQuery {
    title: string | null,
    category_id: string | null;
    description: string | null;
    author_id: string | null;
    sort: string | null;
    fields: string | null;
    isPublic: string | null;
    page: number | null;
    limit: number | null;
}