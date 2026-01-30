import { useRef, useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface DiffEditorWrapperProps {
  original: string;
  modified: string;
  language: string;
  theme?: string;
  onContentChange: (original: string, modified: string) => void;
  onCursorChange: (ln: number, col: number) => void;
}

const DiffEditorWrapper = ({
  original,
  modified,
  language,
  theme = "vs-dark",
  onContentChange,
  onCursorChange
}: DiffEditorWrapperProps) => {
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const [isOriginalEmpty, setIsOriginalEmpty] = useState(!original);
  const [isModifiedEmpty, setIsModifiedEmpty] = useState(!modified);

  const handleEditorDidMount = (editor: editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editor;
    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();

    const editorOptions = {
      folding: true,
      foldingStrategy: 'indentation' as const,
      showFoldingControls: 'always' as const,
      foldingHighlight: true,
      foldingImportsByDefault: false,
      glyphMargin: true,
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 10,
      lineNumbers: 'on' as const,
    };

    console.log('🔧 Applying folding options to editors:', editorOptions);
    originalEditor.updateOptions(editorOptions);
    modifiedEditor.updateOptions(editorOptions);

    setTimeout(() => {
      const origOptions = originalEditor.getOptions();
      const modOptions = modifiedEditor.getOptions();
      console.log('✅ Original editor folding enabled:', origOptions.get(39));
      console.log('✅ Modified editor folding enabled:', modOptions.get(39));
    }, 1000);

    modifiedEditor.onDidChangeCursorPosition((e) => {
      onCursorChange(e.position.lineNumber, e.position.column);
    });

    const originalModel = originalEditor.getModel();
    const modifiedModel = modifiedEditor.getModel();

    if (originalModel && modifiedModel) {
      originalModel.onDidChangeContent(() => {
        const val = originalModel.getValue();
        setIsOriginalEmpty(val.length === 0);
        onContentChange(val, modifiedModel.getValue());
      });
      modifiedModel.onDidChangeContent(() => {
        const val = modifiedModel.getValue();
        setIsModifiedEmpty(val.length === 0);
        onContentChange(originalModel.getValue(), val);
      });
    }
  };

  return (
    <div className="relative h-full w-full group">
      {isOriginalEmpty && (
        <div
          className="absolute left-0 top-0 z-10 pointer-events-none select-none pl-[60px] pt-[10px]"
          style={{
            color: theme === 'vs-dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace', monospace",
            fontSize: '14px'
          }}
        >
          Paste your code here...
        </div>
      )}
      {isModifiedEmpty && (
        <div
          className="absolute left-1/2 top-0 z-10 pointer-events-none select-none pl-[60px] pt-[10px]"
          style={{
            color: theme === 'vs-dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace', monospace",
            fontSize: '14px'
          }}
        >
          Write your code here...
        </div>
      )}

      <DiffEditor
        height="100%"
        width="100%"
        theme={theme}
        language={language}
        original={original}
        modified={modified}
        onMount={handleEditorDidMount}
        options={{
          originalEditable: true,
          renderSideBySide: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace', monospace",
          padding: { top: 10 },
          automaticLayout: true,
          renderOverviewRuler: false,
          folding: true,
          foldingStrategy: 'auto',
          showFoldingControls: 'always',
          foldingHighlight: true,
          foldingImportsByDefault: false,
          glyphMargin: true,
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
};
export default DiffEditorWrapper;