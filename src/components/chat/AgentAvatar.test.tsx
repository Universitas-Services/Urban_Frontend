import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgentAvatar } from './AgentAvatar';

// Mock del objeto de configuración para asegurar predictibilidad en los tests.
vi.mock('@/config/app.config', () => ({
    APP_CONFIG: {
        AGENT_NAME: 'MockAgent',
        AGENT_AVATAR_URL: '', // Probamos primero la versión sin URL (Sparkles)
    },
}));

describe('AgentAvatar Component', () => {
    it('renders the generic Sparkles icon when no AVATAR_URL is present', () => {
        const { container } = render(<AgentAvatar size="sm" />);
        // El SVG de lucide-react (Sparkles) se renderiza
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('text-on-primary');
    });

    it('renders the correct size classes for "sm"', () => {
        const { container } = render(<AgentAvatar size="sm" />);
        const avatarDiv = container.firstChild as HTMLElement;
        expect(avatarDiv).toHaveClass('w-8');
        expect(avatarDiv).toHaveClass('h-8');
    });

    it('renders the correct size classes for "lg"', () => {
        const { container } = render(<AgentAvatar size="lg" />);
        const avatarDiv = container.firstChild as HTMLElement;
        expect(avatarDiv).toHaveClass('w-[120px]');
        expect(avatarDiv).toHaveClass('h-[120px]');
    });

    it('appends custom classNames if provided', () => {
        const { container } = render(<AgentAvatar size="sm" className="custom-test-class" />);
        const avatarDiv = container.firstChild as HTMLElement;
        expect(avatarDiv).toHaveClass('custom-test-class');
    });
});
