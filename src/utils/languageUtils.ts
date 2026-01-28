import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import java from 'highlight.js/lib/languages/java';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('python', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('php', php);
hljs.registerLanguage('java', java);

export const mapHljsToMonaco = (hljsLang: string): string => {
  const map: Record<string, string> = {
    'javascript': 'javascript', 'js': 'javascript',
    'typescript': 'typescript', 'ts': 'typescript',
    'java': 'java',
    'python': 'python', 'py': 'python',
    'html': 'html', 'xml': 'xml',
    'css': 'css',
    'yaml': 'yaml', 'yml': 'yaml',
    'json': 'json',
    'sql': 'sql',
    'markdown': 'markdown', 'md': 'markdown',
    'php': 'php'
  };
  return map[hljsLang] || 'plaintext';
};

export const detectLanguage = (code: string): string => {
  if (!code || !code.trim()) return 'plaintext';
  try {
    const result = hljs.highlightAuto(code);
    return mapHljsToMonaco(result.language || '');
  } catch (e) {
    console.warn("Detection failed", e);
    return 'plaintext';
  }
};