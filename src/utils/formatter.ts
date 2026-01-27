import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserHtml from 'prettier/plugins/html';
import parserPostcss from 'prettier/plugins/postcss';
import parserYaml from 'prettier/plugins/yaml';
import parserEstree from 'prettier/plugins/estree';

const PARSER_MAP: Record<string, string> = {
  javascript: 'babel',
  typescript: 'typescript',
  html: 'html',
  css: 'css',
  json: 'json',
  yaml: 'yaml',
  xml: 'html',
};

export const formatCode = async (code: string, language: string): Promise<string> => {
  if (!code || !code.trim()) return code;

  const parser = PARSER_MAP[language];
  if (!parser) throw new Error(`Formatting not supported for ${language}`);

  try {
    return await prettier.format(code, {
      parser,
      plugins: [parserBabel, parserHtml, parserPostcss, parserYaml, parserEstree],
      printWidth: 80,
      tabWidth: 2,
      semi: true,
      singleQuote: true,
    });
  } catch (e) {
    console.error("Formatting failed", e);
    throw new Error("Syntax Error: Unable to format");
  }
};