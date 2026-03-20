import React, { useState, useEffect } from 'react';

interface PhoneViewWrapperProps {
  children: React.ReactNode;
}

const PhoneViewWrapper: React.FC<PhoneViewWrapperProps> = ({ children }) => {
  const [phoneView, setPhoneView] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setPhoneView(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!phoneView) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-8">
      <div className="relative">
        {/* Phone frame */}
        <div
          className="rounded-[3rem] border-[6px] border-gray-800 overflow-hidden shadow-2xl"
          style={{
            width: 390,
            height: 844,
            background: 'hsl(var(--background))',
          }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-gray-800 rounded-b-2xl z-[100]" />
          {/* Content */}
          <div className="w-full h-full overflow-auto pt-7">
            {children}
          </div>
        </div>
        {/* Label */}
        <div className="text-center mt-4 text-gray-400 text-sm font-medium">
          Phone Preview — <kbd className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300">Ctrl+Shift+E</kbd> to exit
        </div>
      </div>
    </div>
  );
};

export default PhoneViewWrapper;
