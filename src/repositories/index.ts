import type { Config } from "../config"
import { FileNotFound } from "../errors";
import type { IFileRepository, Repositories } from "./types";

import fs from "fs/promises"
import path from "path"

class FileRepository implements IFileRepository {
    private baseFolder: string;

    constructor(cfg: Config) {
        this.baseFolder = cfg.notesFolder;
    }

    private async getDeepMarkdownFiles(folder: string): Promise<string[]> {
        const files = await fs.readdir(folder);

        const subFolders = files.filter((file) => !file.includes('.'));
        const subMarkdownFiles = await Promise.all(subFolders.map(async (subFolder) => {
            const deepFiles = await this.getDeepMarkdownFiles(`${folder}/${subFolder}`);
            return deepFiles.map((file) => `${subFolder}/${file}`);
        }));

        const markdownFiles = files.filter((file) => file.endsWith('.md'));
        return markdownFiles.concat(subMarkdownFiles.flat());
    }

    async getNotes(): Promise<string[]> {
        const paths = await this.getDeepMarkdownFiles(this.baseFolder);
        return paths.map((path) => path.replace('.md', '')).sort()
    }

    private getNoteFullPath(unsafePath: string): string {
        const normalized = path.normalize(unsafePath);
        const fullPath = path.join(this.baseFolder, normalized);
        const canonicalPath = path.resolve(fullPath);

        if (!canonicalPath.startsWith(path.resolve(this.baseFolder))) {
            throw new Error('Invalid path');
        }

        return `${canonicalPath}.md`;
    }

    async getNoteContent(note: string): Promise<string> {
        const path = await this.getNoteFullPath(note);
        if (!await fs.exists(path)) throw new FileNotFound(note)
        return await fs.readFile(path, 'utf-8');
    }

    async saveNoteContent(note: string, content: string): Promise<void> {
        const path = await this.getNoteFullPath(note);
        await fs.writeFile(path, content);
    }

    async createNote(note: string): Promise<void> {
        const path = await this.getNoteFullPath(note);
        const folder = path.split('/').slice(0, -1).join('/');
        await fs.mkdir(folder, { recursive: true });
        await fs.writeFile(path, '');
    }

    async deleteNoteContent(note: string): Promise<void> {
        const path = await this.getNoteFullPath(note);
        await fs.unlink(path);
    }
}

export const getRepositories = (cfg: Config): Repositories => {
    return {
        files: new FileRepository(cfg),
    }
}