import type { Serve } from 'bun';

import type { Config } from './config';
import type { Repositories } from './repositories/types';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { newForm, updateForm } from './schema';
import { Sidebar, NoteEditor, Home, NewPopup, NoteViewer, DeletePopup } from './components';
import { FileNotFound } from './errors';

export const getApp = (cfg: Config, repos: Repositories): Serve<any> => {
  const app = new Hono();

  app.get('/', async (c) => c.html(Home()));

  app.get('/_ok', async (c) => c.text('OK'));

  app.get('/_new', async (c) => c.html(NewPopup()));

  app.post('/_new', zValidator('form', newForm), async (c) => {
    const { name } = c.req.valid('form');
    await repos.files.createNote(name);
    c.header('HX-Redirect', `/${name}`);
    return c.text('OK');
  });

  app.get('/_sidebar', async (c) => {
    const paths = await repos.files.getNotes();
    return c.html(Sidebar({ paths }));
  });

  app.get('/_delete/:path{.*}', async (c) => c.html(DeletePopup(c.req.param('path'))));

  app.get('/_redirect/:path{.*}', async (c) => {
    const path = c.req.param('path');
    const query = c.req.query();
    const urlsearch = new URLSearchParams(query).toString();
    c.header('HX-Redirect', `/${path}?${urlsearch}`);
    return c.text('OK');
  });

  app.get('/:path{.*}', async (c) => {
    const path = c.req.param('path');
    const edit = c.req.query('edit') != undefined;
    const content = await repos.files.getNoteContent(path);

    if (edit) return c.html(NoteEditor(path, content));
    return c.html(NoteViewer(path, content));
  });

  app.post('/:path{.*}', zValidator('form', updateForm), async (c) => {
    const path = c.req.param('path');
    const { content } = c.req.valid('form');
    await repos.files.saveNoteContent(path, content);
    return c.text('OK');
  })

  app.delete('/:path{.*}', async (c) => {
    const path = c.req.param('path');
    await repos.files.deleteNoteContent(path);
    c.header('HX-Redirect', '/');
    return c.text('OK');
  });

  app.onError((err, c) => {
    console.error(err);

    if (err instanceof FileNotFound) {
      c.status(404);
      return c.text('File not found');
    }

    c.status(500);
    return c.text('Internal server error');
  })

  return { fetch: app.fetch, port: cfg.port, };
};
