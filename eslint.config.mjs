import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // Several animation/audio effects intentionally drive finite state
      // machines in response to external browser state. They are not derived
      // render state and cannot be replaced by a simple calculation.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'public/**',
    'next-env.d.ts',
  ]),
]);
