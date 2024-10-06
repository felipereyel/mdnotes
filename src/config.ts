export type Config = {
    notesFolder: string;
    port: number;
}

export const getConfig = (): Config => {
    return {
        notesFolder: process.env.NOTES_FOLDER || 'notes',
        port: Number(process.env.PORT) || 3333,
    };
}