export class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request') {
        super(400, message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class NotFoundError extends HttpError {
    constructor(message = 'Not Found') {
        super(404, message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
