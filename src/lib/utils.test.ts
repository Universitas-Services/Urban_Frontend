import { describe, it, expect } from 'vitest';
import { formatRelativeDate } from './utils';

describe('formatRelativeDate', () => {
    it('returns "Hoy" for the current date', () => {
        const today = new Date().toISOString();
        expect(formatRelativeDate(today)).toBe('Hoy');
    });

    it('returns "Ayer" for yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(formatRelativeDate(yesterday.toISOString())).toBe('Ayer');
    });

    it('returns "Esta semana" for dates within the last 6 days', () => {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        expect(formatRelativeDate(threeDaysAgo.toISOString())).toBe('Esta semana');
    });

    it('returns "Anteriores" for dates older than 6 days', () => {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        expect(formatRelativeDate(tenDaysAgo.toISOString())).toBe('Anteriores');
    });
});
