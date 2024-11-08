export class FileNotFound extends Error {
    constructor(public readonly path: string) {
        super(`File not found: ${path}`);
    }
}