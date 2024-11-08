export interface IFileRepository {
    getNotes(): Promise<string[]>
    createNote(note: string): Promise<void>
    getNoteContent(note: string): Promise<string>
    saveNoteContent(note: string, content: string): Promise<void>
    deleteNoteContent(note: string): Promise<void>
}

export type Repositories = {
    files: IFileRepository
}
