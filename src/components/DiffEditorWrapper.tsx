import { useRef, useEffect } from 'react';
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
  // Handle Mount
  const handleEditorDidMount = (editor: editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editor;

    // Listen to cursor changes on the Modified (Right) side
    editor.getModifiedEditor().onDidChangeCursorPosition((e) => {
      onCursorChange(e.position.lineNumber, e.position.column);
    });

    // Listen to content changes
    const modifiedModel = editor.getModifiedEditor().getModel();
    const originalModel = editor.getOriginalEditor().getModel();

    if (modifiedModel && originalModel) {
      modifiedModel.onDidChangeContent(() => {
        onContentChange(originalModel.getValue(), modifiedModel.getValue());
      });
      originalModel.onDidChangeContent(() => {
        onContentChange(originalModel.getValue(), modifiedModel.getValue());
      });
    }
  };

  // Update models explicitly if props change externally (like formatting)
  useEffect(() => {
    if (diffEditorRef.current) {
      const model = diffEditorRef.current.getModel();
      if (model) {
        if (model.original.getValue() !== original) model.original.setValue(original);
        if (model.modified.getValue() !== modified) model.modified.setValue(modified);
      }
    }
  }, [original, modified]);

  return (
    <div className="h-full w-full">
      <DiffEditor
        height="100%"
        width="100%"
        theme={theme}
        language={language}
        original={original}
        modified={modified}
        onMount={handleEditorDidMount}
        options={{
          originalEditable: true, // Key feature from your code
          renderSideBySide: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace', monospace",
          padding: { top: 10 }
        }}
      />
    </div>
  );
};

export default DiffEditorWrapper;