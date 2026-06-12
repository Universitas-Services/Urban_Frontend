import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.ComponentProps<'svg'> {
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        icon: 'h-5 w-5',
    };

    return <Loader2 className={cn('animate-spin', sizeClasses[size], className)} {...props} />;
}
