import { IParam } from "./param.interface";

export enum methodEndpoint {
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Head = 'HEAD',
    Delete = 'DELETE',
}

export interface IEndpoint extends Document {
    method: methodEndpoint;
    description: string;
    url: string;
    params: IParam[];
}