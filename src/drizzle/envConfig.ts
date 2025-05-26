import { loadEnvConfig } from '@next/env';

export const projectDir = process.cwd();
loadEnvConfig(projectDir);