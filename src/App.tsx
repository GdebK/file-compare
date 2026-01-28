import { useState, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import DiffEditorWrapper from './components/DiffEditorWrapper';
import { detectLanguage } from './utils/languageUtils';
import { formatCode } from './utils/formatter';
import { Trash2, Wand2 } from 'lucide-react';
import clsx from 'clsx';
import compareImg from '/CompareIcon.png'

function App() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [originalCode, setOriginalCode] = useState('');
  const [modifiedCode, setModifiedCode] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [statusMsg, setStatusMsg] = useState('Ready');
  const [cursorPos, setCursorPos] = useState({ ln: 1, col: 1 });
  const [isFormatting, setIsFormatting] = useState(false);
  const detectionTimeoutRef = useRef<number | null>(null);

  const handleContentChange = useCallback((newOriginal: string, newModified: string) => {
    setOriginalCode(newOriginal);
    setModifiedCode(newModified);

    if (detectionTimeoutRef.current) clearTimeout(detectionTimeoutRef.current);

    detectionTimeoutRef.current = window.setTimeout(() => {
      const codeToCheck = newModified || newOriginal;
      if (!codeToCheck.trim()) {
        setLanguage('plaintext');
        return;
      }

      const detected = detectLanguage(codeToCheck);
      if (detected !== language) {
        setLanguage(detected);
        setStatusMsg(`Detected: ${detected.toUpperCase()}`);
      }
    }, 1200);
  }, [language]);
  const handleClear = () => {
    setOriginalCode('');
    setModifiedCode('');
    setLanguage('plaintext');
    setStatusMsg('Cleared');
  };
  const handleFormat = async () => {
    if (isFormatting) return;
    setIsFormatting(true);
    setStatusMsg('Formatting...');

    try {
      const [fmtOriginal, fmtModified] = await Promise.all([
        formatCode(originalCode, language),
        formatCode(modifiedCode, language)
      ]);

      setOriginalCode(fmtOriginal);
      setModifiedCode(fmtModified);
      setStatusMsg(`Formatted (${language})`);
    } catch (e) {
      setStatusMsg((e as Error).message);
    } finally {
      setIsFormatting(false);
    }
  };


  return (
    <div className="flex h-screen w-full bg-vs-bg text-vs-text overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <div className="flex items-center bg-vs-activityBar h-10 px-0 border-b border-vs-bg select-none">
          <div className="flex items-center gap-2 px-3 py-2 bg-vs-bg text-white text-sm border-t-2 border-blue-500 min-w-[150px]">
            <img className='w-6' src={compareImg} alt="" />
            <span className="truncate">Diff: Original ↔ Modified</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-vs-panel border-b border-vs-bg">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Language</span>
              <span className="text-xs text-blue-400 uppercase tracking-wider font-bold">
                {language === 'plaintext' ? 'Auto Detect...' : language}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white rounded transition border border-gray-600"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={handleFormat}
              disabled={isFormatting}
              className={clsx(
                "flex items-center gap-2 px-3 py-1.5 text-xs text-white rounded transition shadow-sm border border-transparent",
                isFormatting ? 'bg-blue-800 cursor-not-allowed' : 'bg-[#0e639c] hover:bg-[#1177bb]'
              )}
            >
              <Wand2 className="w-3.5 h-3.5" /> {isFormatting ? 'Working...' : 'Beautify'}
            </button>
          </div>
        </div>
        <div className="flex-1 relative bg-vs-bg overflow-hidden">
          <DiffEditorWrapper
            original={originalCode}
            modified={modifiedCode}
            language={language}
            onContentChange={handleContentChange}
            onCursorChange={(ln, col) => setCursorPos({ ln, col })}
          />
        </div>
        <StatusBar
          cursorLn={cursorPos.ln}
          cursorCol={cursorPos.col}
          language={language}
          statusMsg={statusMsg}
        />
      </div>
    </div>
  );
}

export default App;