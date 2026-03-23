import React, { useState, useEffect, createContext, useContext } from 'react';

export const PhoneViewContext = createContext(false);
export const useIsPhoneView = () => useContext(PhoneViewContext);

interface PhoneViewWrapperProps {
  children: React.ReactNode;
}

const PHONE_W = 390;
const PHONE_H = 844;

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

  if (!phoneView) return <PhoneViewContext.Provider value={false}>{children}</PhoneViewContext.Provider>;

  const innerW = 375;
  const innerH = PHONE_H - 40;
  const scale = (PHONE_W - 12) / innerW;

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'hsl(220 14% 14%)' }}>
      <div className="relative">
        <div
          className="rounded-[3rem] border-[6px] overflow-hidden relative"
          style={{
            width: PHONE_W,
            height: PHONE_H,
            borderColor: 'hsl(220 10% 22%)',
            background: 'hsl(var(--background))',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 rounded-full z-[100]" style={{ background: 'hsl(220 10% 10%)' }} />
          <div
            className="overflow-y-auto overflow-x-hidden"
            style={{
              width: PHONE_W - 12,
              height: PHONE_H - 12,
              paddingTop: 32,
            }}
          >
            <div
              className="origin-top-left"
              style={{
                width: innerW,
                minHeight: innerH / scale,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <div style={{ maxWidth: innerW }}>
                <PhoneViewContext.Provider value={true}>
                  {children}
                </PhoneViewContext.Provider>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4 text-sm font-medium" style={{ color: 'hsl(220 10% 50%)' }}>
          Phone Preview — <kbd className="px-2 py-0.5 rounded text-xs" style={{ background: 'hsl(220 10% 22%)', color: 'hsl(220 10% 65%)' }}>Ctrl+Shift+E</kbd> to exit
        </div>
      </div>
    </div>
  );
};

export default PhoneViewWrapper;
