export class BaseError extends Error {
    #payload;

    constructor(payload : any) {
        // eslint-disable-next-line no-constructor-return
        if (payload instanceof BaseError) return payload;
        super();

        this.name = this.constructor.name;
        this.#payload = payload;

        Error.captureStackTrace(this, this.constructor);
    }

    get payload() {
        return this.#payload;
    }
}

export default class API_ERROR extends BaseError {
    get message() {
        const messages = [ this.payload.toString() ];
        const inner  = this.payload.response?.data;

        if (inner) messages.push(JSON.stringify(inner));

        return messages.join(' ');
    }
}