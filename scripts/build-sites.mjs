import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const projectRoot = new URL('../', import.meta.url);
const outDir = new URL('out/', projectRoot);
const distDir = new URL('dist/', projectRoot);
const serverDir = new URL('dist/server/', projectRoot);
const metadataDir = new URL('dist/.openai/', projectRoot);

await rm(distDir, { recursive: true, force: true });
await mkdir(serverDir, { recursive: true });
await mkdir(metadataDir, { recursive: true });
await cp(outDir, new URL('dist/client/', projectRoot), { recursive: true });

const worker = await readFile(new URL('worker/static-export.js', projectRoot));
await writeFile(new URL('dist/server/index.js', projectRoot), worker);
await cp(
  new URL('.openai/hosting.json', projectRoot),
  new URL('dist/.openai/hosting.json', projectRoot),
);

console.log('Prepared the Sites deployment bundle in dist/.');
