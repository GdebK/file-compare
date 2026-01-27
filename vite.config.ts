import { defineConfig, type UserConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import _javascriptObfuscator from 'vite-plugin-javascript-obfuscator';

// Define options for obfuscator
interface ObfuscatorOptions {
  compact?: boolean;
  controlFlowFlattening?: boolean;
  stringArray?: boolean;
  identifierNamesGenerator?: 'hexadecimal' | 'mangled';
}

// Safely resolve the plugin
const javascriptObfuscator = (_javascriptObfuscator as unknown as { default?: (options: ObfuscatorOptions) => Plugin })?.default
  || (_javascriptObfuscator as unknown as (options: ObfuscatorOptions) => Plugin);

export default defineConfig(({ mode }): UserConfig => {
  const isProd = mode === 'production';

  return {
    // REPLACE 'file-compare' with your GitHub Repo Name
    base: isProd ? '/file-compare/' : '/',

    plugins: [
      react(),
      ...(isProd
        ? [
          javascriptObfuscator({
            compact: true,
            controlFlowFlattening: true,
            stringArray: true,
            identifierNamesGenerator: 'hexadecimal',
          })
        ]
        : [])
    ],
    build: {
      // Vite 7 automatically uses OXC for faster builds
      sourcemap: false,
      minify: true,
    }
    // We removed the 'esbuild' block to avoid the "Both esbuild and oxc" conflict
  };
});