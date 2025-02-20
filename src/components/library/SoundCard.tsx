import { useRef } from 'react';
import { Heart, Volume2, Clock } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SoundCardProps {
	index: number;
	name: string;
	path: string;
	duration?: string;
	isPlaying: boolean;
	onPlay: (index: number, path: string) => void;
	is_favorite: boolean;
	onToggleFavorite: () => void;
}

export const SoundCard = ({
	index,
	name,
	path,
	duration = '1:30',
	isPlaying,
	onPlay,
	is_favorite,
	onToggleFavorite,
}: SoundCardProps) => {
	const cardRef = useRef<HTMLDivElement>(null);

	return (
		<main
			ref={cardRef}
			className={cn(
				'group relative overflow-hidden rounded-lg border',
				'transition-all duration-300 ease-in-out',
				isPlaying
					? 'border-neutral-700 bg-neutral-900/90'
					: 'border-neutral-900 bg-neutral-950 hover:border-neutral-800 hover:bg-neutral-900/50'
			)}>
			<div className='relative p-4'>
				<div className='flex items-center gap-4'>
					<div className='flex flex-1 flex-col gap-1'>
						<h3
							className={cn(
								'text-base font-medium',
								isPlaying
									? 'text-neutral-100'
									: 'text-neutral-300 group-hover:text-neutral-100'
							)}>
							{name}
						</h3>
						<div className='flex items-center gap-3 text-xs text-neutral-500'>
							<span className='flex items-center gap-1'>
								<Clock size={12} />
								{duration}
							</span>
							<span className='flex items-center gap-1'>
								<Volume2 size={12} />
								Ambient
							</span>
						</div>
					</div>
					<button
						onClick={onToggleFavorite}
						className={cn(
							'group/fav flex h-10 w-10 items-center justify-center rounded-full',
							'transition-all duration-200',
							'hover:bg-neutral-800/80',
							is_favorite && 'bg-red-500/10'
						)}
						aria-label={
							is_favorite
								? 'Remove from favorites'
								: 'Add to favorites'
						}>
						<Heart
							fill={is_favorite ? 'currentColor' : 'none'}
							size={18}
							className={cn(
								'transition-all duration-200',
								is_favorite
									? 'text-red-500 group-hover/fav:scale-110'
									: 'text-neutral-500 group-hover/fav:scale-110 group-hover/fav:text-neutral-300'
							)}
						/>
					</button>
				</div>
			</div>
		</main>
	);
};
