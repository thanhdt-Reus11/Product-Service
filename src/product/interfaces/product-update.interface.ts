import { IEndpoint } from "./endpoint.interface";

export interface IProductUpdate {
    id: string;
    category_id: string;
    title: string;
    description: string;
    price: number;
    documentation: string;
    version: string;
    isPublic: boolean;
    host: string;
    endpoint: IEndpoint;
}