import { factory } from './app';

const options = factory(3333);
const server = Bun.serve(options);
console.log(`Listening on http://localhost:${server.port}`);
