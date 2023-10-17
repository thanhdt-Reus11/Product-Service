import { RpcException } from "@nestjs/microservices";

export type MsExceptionTypes = 'BadRequest' | 'NotFound' | 'UnprocessableEntity' | 'Unknown' ;

export class MsTypesException extends RpcException {
    readonly type: MsExceptionTypes;

    constructor(type: MsExceptionTypes, message: string | unknown) {
        const error = {
            type,
            message
        };

        super(error);
        error.type = type;
    }
}

export class MsBadRequestException extends MsTypesException {
    constructor(message: string | unknown) {
        super('BadRequest', message);
    }
}


export class MsNotFoundException extends MsTypesException {
    constructor(message: string | unknown) {
        super('NotFound', message);
    }
}

export class MsUnprocessableEntityException extends MsTypesException {
    constructor(message: string | unknown) {
        super('UnprocessableEntity', message);
    }
}

export class MsUnknownException extends MsTypesException {
    constructor(message: string | unknown) {
        super('Unknown', message);
    }
}