export default class LibError extends Error {
    readonly details: any;
    constructor(message: string, details: any);
}
