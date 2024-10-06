import { Hono } from 'hono';
import type { Serve } from 'bun';
import { createBunWebSocket } from 'hono/bun';
import { zValidator } from '@hono/zod-validator';

import { type Body, body } from './schema';
import { Home, NewPopup, Entries } from './components';

export const factory = (port: number): Serve<any> => {
  const entries: Body[] = [];

  const { upgradeWebSocket, websocket } = createBunWebSocket();
  const app = new Hono();

  app.get('/', async (c) => c.html(Home));
  app.get('/ok', async (c) => c.text('OK'));

  app.get('/new', async (c) => c.html(NewPopup));
  app.post('/new', zValidator('form', body), async (c) => {
    entries.push(c.req.valid('form'));
    return c.text('OK');
  });

  app.get(
    '/ws',
    upgradeWebSocket((c) => {
      let intervalId: Timer;
      return {
        onOpen(_event, ws) {
          intervalId = setInterval(() => {
            ws.send(Entries(entries).toString());
          }, 500);
        },
        onMessage(event, ws) {
          console.log(event.data);
        },
        onClose() {
          clearInterval(intervalId);
        },
      };
    }),
  );

  return {
    fetch: app.fetch,
    port: 3333,
    websocket,
  };
};
