export class IndexOutOfBoundsError extends Error {
    public name : string;
    constructor(message = "", ...arg) {
        super('IndexOutOfBoundsError: ' + message, ...arg);

        this.name = 'IndexOutOfBoundsError';
    }
}