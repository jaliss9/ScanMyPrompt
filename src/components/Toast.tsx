'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ToastContextValue {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isLeaving, setIsLeaving] = useState(false);

    const showToast = useCallback((message: string) => {
        setIsLeaving(false);
        setToastMessage(message);
        setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => setToastMessage(null), 300);
        }, 1700);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast UI */}
            {toastMessage && (
                <div
                    className={`fixed bottom-8 right-8 z-[60] ${isLeaving ? 'animate-slide-down-out' : 'animate-slide-up'}`}
                >
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-900 text-white rounded-xl shadow-lg shadow-black/20">
                        <svg
                            className="w-5 h-5 text-emerald-400 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M22 11.08V12a10 10 0 11-5.93-9.14"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 11l3 3L22 4"
                            />
                        </svg>
                        <span className="font-medium text-sm">{toastMessage}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
}
