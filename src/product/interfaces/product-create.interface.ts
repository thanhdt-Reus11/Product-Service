import { IEndpoint } from "./endpoint.interface";

export interface IProductCreate {
    category_id: string;
    title: string;
    description: string;
    price: number;
    documentation: string;
    version: string;
    isPublic: boolean;
    host: string;
    author_id: string;
    endpoint: IEndpoint;
}