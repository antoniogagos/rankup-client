import { createWebDevServerConfig } from '../../web-dev-server.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default createWebDevServerConfig(appRoot);
