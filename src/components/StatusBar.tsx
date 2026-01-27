import React from 'react';
import { GitBranch, AlertCircle, Bell } from 'lucide-react';

interface StatusBarProps {
  cursorLn: number;
  cursorCol: number;
  language: string;
  statusMsg: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ cursorLn, cursorCol, language, statusMsg }) => {
  return (
    <div className="h-6 bg-vs-accent text-white text-xs flex items-center px-3 justify-between select-none shrink-0 z-10">
      <div className="flex gap-4">
        <span className="flex items-center gap-1 hover:bg-white/20 px-1 cursor-pointer">
          <GitBranch className="w-3 h-3" /> main*
        </span>
        <span className="flex items-center gap-1 hover:bg-white/20 px-1 cursor-pointer">
          <AlertCircle className="w-3 h-3" /> 0
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <span className="hidden sm:inline">Ln {cursorLn}, Col {cursorCol}</span>
        <span className="hidden sm:inline">UTF-8</span>
        <span className="uppercase font-medium hover:bg-white/20 px-1 cursor-pointer">
          {language}
        </span>

        {statusMsg && (
          <span className="font-semibold ml-2 bg-white/20 px-2 rounded-sm min-w-[100px] text-center transition-all">
            {statusMsg}
          </span>
        )}

        <span className="hover:bg-white/20 px-1 cursor-pointer">
          <Bell className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default StatusBar;