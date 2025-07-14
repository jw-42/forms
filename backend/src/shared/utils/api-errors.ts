import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiError extends Error {
    status: number;
    errors: any[];

    constructor(status: number, message: string, errors: any[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message: string = 'One of the parameters is invalid or not provided', errors: any[] = []) {
        return new ApiError(400, message, errors);
    }

    static Unauthorized(message: string = 'User is not authorized') {
        return new ApiError(401, message);
    }

    static NotFound(message: string = 'Resource not found') {
        return new ApiError(404, message);
    }

    static Forbidden(message: string = 'Access denied') {
        return new ApiError(403, message);
    }

    static Conflict(message: string = 'Request conflicts with current state') {
        return new ApiError(409, message);
    }

    static Internal(message: string = 'Internal server error') {
        return new ApiError(500, message);
    }
}