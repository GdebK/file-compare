import React from 'react';
import { Files } from 'lucide-react';
import clsx from 'clsx';
import compareImg from '/File.png'

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const icons = [
    { id: 'explorer', icon: Files }
  ];

  return (
    <div className="w-12 bg-vs-sidebar flex flex-col items-center py-2 h-full border-r border-vs-bg select-none">
      <div className="mb-4 text-blue-500">
        <img src={compareImg} alt="" />
      </div>

      {icons.map((item) => (
        <div
          key={item.id}
          className={clsx(
            "p-3 mb-2 cursor-pointer border-l-2 transition-colors",
            activeTab === item.id
              ? "border-blue-500 text-white"
              : "border-transparent text-gray-400 hover:text-white"
          )}
          onClick={() => setActiveTab(item.id)}
        >
          <item.icon className="w-6 h-6" />
        </div>
      ))}

    </div>
  );
};

export default Sidebar;