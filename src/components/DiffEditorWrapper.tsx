// import { useRef } from 'react';
// import { DiffEditor } from '@monaco-editor/react';
// import type { editor } from 'monaco-editor';

// interface DiffEditorWrapperProps {
//   original: string;
//   modified: string;
//   language: string;
//   theme?: string;
//   onContentChange: (original: string, modified: string) => void;
//   onCursorChange: (ln: number, col: number) => void;
// }

// const DiffEditorWrapper = ({
//   original,
//   modified,
//   language,
//   theme = "vs-dark",
//   onContentChange,
//   onCursorChange
// }: DiffEditorWrapperProps) => {
//   const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

//   const handleEditorDidMount = (editor: editor.IStandaloneDiffEditor) => {
//     diffEditorRef.current = editor;

//     editor.getModifiedEditor().onDidChangeCursorPosition((e) => {
//       onCursorChange(e.position.lineNumber, e.position.column);
//     });

//     const originalModel = editor.getOriginalEditor().getModel();
//     const modifiedModel = editor.getModifiedEditor().getModel();

//     if (originalModel && modifiedModel) {
//       originalModel.onDidChangeContent(() => {
//         const val = originalModel.getValue();
//         onContentChange(val, modifiedModel.getValue());
//       });

//       modifiedModel.onDidChangeContent(() => {
//         const val = modifiedModel.getValue();
//         onContentChange(originalModel.getValue(), val);
//       });
//     }
//   };

//   return (
//     <div className="h-full w-full">
//       <DiffEditor
//         height="100%"
//         width="100%"
//         theme={theme}
//         language={language}
//         original={original}
//         modified={modified}
//         onMount={handleEditorDidMount}
//         options={{
//           originalEditable: true,
//           renderSideBySide: true,
//           minimap: { enabled: false },
//           scrollBeyondLastLine: false,
//           fontSize: 14,
//           fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace', monospace",
//           padding: { top: 10 },
//           automaticLayout: true,
//         }}
//       />
//     </div>
//   );
// };

// export default DiffEditorWrapper;


// import { useRef } from 'react';
// import { DiffEditor } from '@monaco-editor/react';
// import type { editor } from 'monaco-editor';

// interface DiffEditorWrapperProps {
//   original: string;
//   modified: string;
//   language: string;
//   theme?: string;
//   onContentChange: (original: string, modified: string) => void;
//   onCursorChange: (ln: number, col: number) => void;
// }

// const DiffEditorWrapper = ({
//   original,
//   modified,
//   language,
//   theme = "vs-dark",
//   onContentChange,
//   onCursorChange
// }: DiffEditorWrapperProps) => {
//   const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
//   const isInternalUpdateRef = useRef(false);

//   const handleEditorDidMount = (editor: editor.IStandaloneDiffEditor) => {
//     diffEditorRef.current = editor;

//     const modifiedEditor = editor.getModifiedEditor();
//     const originalEditor = editor.getOriginalEditor();

//     // Track cursor position
//     modifiedEditor.onDidChangeCursorPosition((e) => {
//       onCursorChange(e.position.lineNumber, e.position.column);
//     });

//     const modifiedModel = modifiedEditor.getModel();
//     const originalModel = originalEditor.getModel();

//     if (modifiedModel && originalModel) {
//       // Listen to content changes in modified editor
//       modifiedModel.onDidChangeContent(() => {
//         if (!isInternalUpdateRef.current) {
//           isInternalUpdateRef.current = true;
//           onContentChange(originalModel.getValue(), modifiedModel.getValue());
//           isInternalUpdateRef.current = false;
//         }
//       });

//       // Listen to content changes in original editor
//       originalModel.onDidChangeContent(() => {
//         if (!isInternalUpdateRef.current) {
//           isInternalUpdateRef.current = true;
//           onContentChange(originalModel.getValue(), modifiedModel.getValue());
//           isInternalUpdateRef.current = false;
//         }
//       });
//     }
//   };

//   return (
//     <div className="h-full w-full">
//       <DiffEditor
//         height="100%"
//         width="100%"
//         theme={theme}
//         language={language}
//         original={original}
//         modified={modified}
//         onMount={handleEditorDidMount}
//         options={{
//           originalEditable: true,
//           renderSideBySide: true,
//           minimap: { enabled: false },
//           scrollBeyondLastLine: false,
//           fontSize: 14,
//           fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace', monospace",
//           padding: { top: 10 }
//         }}
//       />
//     </div>
//   );
// };

// export default DiffEditorWrapper;

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
  const isUserTypingRef = useRef(false);
  const lastOriginalRef = useRef(original);
  const lastModifiedRef = useRef(modified);

  const handleEditorDidMount = (editor: editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editor;

    const modifiedEditor = editor.getModifiedEditor();
    const originalEditor = editor.getOriginalEditor();

    // Track cursor position
    modifiedEditor.onDidChangeCursorPosition((e) => {
      onCursorChange(e.position.lineNumber, e.position.column);
    });

    const modifiedModel = modifiedEditor.getModel();
    const originalModel = originalEditor.getModel();

    if (modifiedModel && originalModel) {
      // Listen to content changes in modified editor
      modifiedModel.onDidChangeContent(() => {
        if (isUserTypingRef.current) return;

        isUserTypingRef.current = true;
        const newOriginal = originalModel.getValue();
        const newModified = modifiedModel.getValue();
        lastOriginalRef.current = newOriginal;
        lastModifiedRef.current = newModified;
        onContentChange(newOriginal, newModified);
        setTimeout(() => {
          isUserTypingRef.current = false;
        }, 0);
      });

      // Listen to content changes in original editor
      originalModel.onDidChangeContent(() => {
        if (isUserTypingRef.current) return;

        isUserTypingRef.current = true;
        const newOriginal = originalModel.getValue();
        const newModified = modifiedModel.getValue();
        lastOriginalRef.current = newOriginal;
        lastModifiedRef.current = newModified;
        onContentChange(newOriginal, newModified);
        setTimeout(() => {
          isUserTypingRef.current = false;
        }, 0);
      });
    }
  };

  // Handle external updates (like formatting)
  useEffect(() => {
    if (!diffEditorRef.current) return;

    const editor = diffEditorRef.current;
    const modifiedEditor = editor.getModifiedEditor();
    const originalEditor = editor.getOriginalEditor();

    const modifiedModel = modifiedEditor.getModel();
    const originalModel = originalEditor.getModel();

    if (!modifiedModel || !originalModel) return;

    // Only update if the value actually changed from outside (not from user typing)
    if (original !== lastOriginalRef.current && original !== originalModel.getValue()) {
      isUserTypingRef.current = true;
      const position = originalEditor.getPosition();
      originalModel.setValue(original);
      if (position) {
        originalEditor.setPosition(position);
      }
      lastOriginalRef.current = original;
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 0);
    }

    if (modified !== lastModifiedRef.current && modified !== modifiedModel.getValue()) {
      isUserTypingRef.current = true;
      const position = modifiedEditor.getPosition();
      modifiedModel.setValue(modified);
      if (position) {
        modifiedEditor.setPosition(position);
      }
      lastModifiedRef.current = modified;
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 0);
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
          originalEditable: true,
          renderSideBySide: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace', monospace",
          padding: { top: 10 },
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default DiffEditorWrapper;