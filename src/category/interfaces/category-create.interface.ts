import { ICategoryCreate } from "./category-update.interface";

export interface ICategoryUpdate extends ICategoryCreate {
    id: string;
}