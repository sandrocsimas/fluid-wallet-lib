"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LibError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
        Object.setPrototypeOf(this, LibError.prototype);
    }
}
exports.default = LibError;
