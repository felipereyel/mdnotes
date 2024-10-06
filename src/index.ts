import { getApp } from './app';
import { getConfig } from './config';
import { getRepositories } from './repositories';

const config = getConfig();
const repos = getRepositories(config);
const options = getApp(config, repos);

Bun.serve(options);
