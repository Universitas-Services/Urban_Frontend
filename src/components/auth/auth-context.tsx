'use client';

import { createContext, useContext } from 'react';

export type AuthPanelTheme = 'login' | 'register';

type AuthPanelContextValue = {
    isPanel: boolean;
    theme: AuthPanelTheme;
};

export const AuthPanelContext = createContext<AuthPanelContextValue>({
    isPanel: true,
    theme: 'login',
});

const labelClass = 'text-primary font-bold text-sm';
const subtextClass = 'text-neutral-dark/60 text-sm';
const titleClass = 'font-display text-2xl sm:text-3xl font-bold text-primary';
const inputBase = 'auth-panel-input h-11';
const inputDefault =
    'bg-surface-light border-transparent focus:border-auth-accent focus:ring-auth-accent text-neutral-dark h-11';

export function useAuthFormStyles() {
    const { isPanel } = useContext(AuthPanelContext);

    return {
        isPanel,
        label: labelClass,
        subtext: subtextClass,
        title: titleClass,
        input: isPanel ? inputBase : inputDefault,
        inputWithPl10: isPanel ? `${inputBase} pl-10` : `${inputDefault} pl-10`,
        inputWithPr10: isPanel ? `${inputBase} pr-10` : `${inputDefault} pr-10`,
        inputWithPx10: isPanel ? `${inputBase} pl-10 pr-10` : `${inputDefault} pl-10 pr-10`,
        iconMuted: 'text-neutral-dark/40',
        link: 'text-sm text-auth-accent hover:underline font-medium',
        footerText: 'text-sm text-neutral-dark/60',
        divider: 'border-surface-soft/60',
        submitBtn:
            'w-full bg-auth-accent hover:bg-auth-accent/90 text-on-primary active:scale-95 transition-all text-base h-12 rounded-full font-bold shadow-lg shadow-auth-accent/20',
        stepActive: 'bg-primary text-white shadow-md shadow-primary/20',
        stepInactive: 'bg-white/80 text-neutral-dark/40',
        stepLabelActive: 'text-primary font-bold',
        stepLabelInactive: 'text-neutral-dark/40 font-medium',
        checkboxLabel: 'text-sm text-neutral-dark/60',
        messageError: 'text-red-500 font-medium text-xs',
    };
}
