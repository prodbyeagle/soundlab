import { LucideIcon } from 'lucide-react';

export interface BadgeProps {
	variant?: 'neutral' | 'secondary' | 'border' | 'danger' | 'success';
	icon?: LucideIcon;
	text?: string;
}
