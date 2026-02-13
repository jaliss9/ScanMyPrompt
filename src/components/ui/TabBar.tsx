'use client';

import { useEffect, useRef, useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    const activeElement = tabsRef.current[activeIndex];

    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="relative flex p-1 glass-panel rounded-xl bg-black/20 backdrop-blur-md border border-white/5">
      {/* Sliding Indicator */}
      <div
        className="absolute top-1 bottom-1 bg-violet-600 rounded-lg shadow-lg shadow-violet-600/20 transition-all duration-300 ease-out z-0"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />

      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { tabsRef.current[index] = el; }}
          onClick={() => onTabChange(tab.id)}
          className={`relative z-10 flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 text-center ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
