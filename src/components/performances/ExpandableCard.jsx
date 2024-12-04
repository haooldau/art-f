import React from 'react';
import { X } from 'lucide-react';

const ExpandableCard = ({ title, isOpen, onClose, children }) => {
  return (
    <div
      className={`
        absolute inset-0 bg-[#1a1b1e]/95 backdrop-blur-md
        rounded-2xl border border-white/10 overflow-hidden
        transition-all duration-300 ease-out
        ${isOpen ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95 pointer-events-none'}
      `}
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(100%-4rem)]">
        {children}
      </div>
    </div>
  );
};

export default ExpandableCard; 