import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserTypescript from 'prettier/plugins/typescript';
import parserHtml from 'prettier/plugins/html';
import parserPostcss from 'prettier/plugins/postcss';
import parserYaml from 'prettier/plugins/yaml';
import parserMarkdown from 'prettier/plugins/markdown';
import parserEstree from 'prettier/plugins/estree';

const PARSER_MAP: Record<string, string> = {
  javascript: 'babel',
  typescript: 'typescript',
  html: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  json: 'json',
  json5: 'json5',
  yaml: 'yaml',
  xml: 'html',
  markdown: 'markdown',
  python: 'babel', // fallback
  java: 'babel', // fallback
  php: 'babel', // fallback
  sql: 'babel', // fallback
  plaintext: 'babel', // fallback
};

export const formatCode = async (code: string, language: string): Promise<string> => {
  if (!code || !code.trim()) return code;

  const parser = PARSER_MAP[language.toLowerCase()] || 'babel';

  try {
    const formatted = await prettier.format(code, {
      parser,
      plugins: [
        parserBabel,
        parserTypescript,
        parserHtml,
        parserPostcss,
        parserYaml,
        parserMarkdown,
        parserEstree
      ],
      printWidth: 80,
      tabWidth: 2,
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      arrowParens: 'avoid',
    });
    return formatted;
  } catch (e) {
    console.error("Formatting failed", e);
    // If formatting fails, return original code instead of throwing
    return code;
  }
};