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

    // Handle cursor changes for the modified editor
    editor.getModifiedEditor().onDidChangeCursorPosition((e) => {
      onCursorChange(e.position.lineNumber, e.position.column);
    });

    const originalEditor = editor.getOriginalEditor();
    const modifiedEditor = editor.getModifiedEditor();
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
        }}
      />
    </div>
  );
};

export default DiffEditorWrapper;