import type { Serve } from 'bun';

import type { Config } from './config';
import type { Repositories } from './repositories/types';

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { newForm, updateForm } from './schema';
import { ClosedSidebar, Editor, Home, NewPopup, OpenSidebar } from './components';

export const getApp = (cfg: Config, repos: Repositories): Serve<any> => {
  const app = new Hono();

  app.get('/', async (c) => c.html(Home()));

  app.get('/_ok', async (c) => c.text('OK'));
  app.get('/_new', async (c) => c.html(NewPopup()));
  app.get('/_closedsidebar', async (c) => c.html(ClosedSidebar()));

  app.get('/_opensidebar', async (c) => {
    const paths = await repos.files.getNotes();
    return c.html(OpenSidebar(paths));
  });

  app.post('/new', zValidator('form', newForm), async (c) => {
    const { name } = c.req.valid('form');
    await repos.files.createNote(name);
    c.header('HX-Redirect', `/${name}`);
    return c.text('OK');
  });

  app.get('/:path{.*}', async (c) => {
    const path = c.req.param('path');
    const content = await repos.files.getNoteContent(path);
    return c.html(Editor(path, content));
  });

  app.post('/:path{.*}', zValidator('form', updateForm), async (c) => {
    const path = c.req.param('path');
    const { content } = c.req.valid('form');
    await repos.files.saveNoteContent(path, content);
    return c.text('OK');
  })

  return { fetch: app.fetch, port: cfg.port, };
};
