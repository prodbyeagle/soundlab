import { useRef } from 'react';
import { Play, Pause, Heart, Volume2, Clock } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button/Button';

interface SoundCardProps {
	index: number;
	name: string;
	path: string;
	duration?: string;
	isPlaying: boolean;
	onPlay: (index: number, path: string) => void;
	isFavorite: boolean;
	onToggleFavorite: (index: number) => void;
}

const SoundCard = ({
	index,
	name,
	path,
	duration = '1:30',
	isPlaying,
	onPlay,
	isFavorite,
	onToggleFavorite,
}: SoundCardProps) => {
	const cardRef = useRef<HTMLDivElement>(null);

	return (
		<main
			ref={cardRef}
			className={cn(
				'group relative overflow-hidden rounded-xl border',
				'transition-all duration-300 ease-in-out',
				isPlaying
					? 'border-neutral-700 bg-neutral-900/90'
					: 'border-neutral-900 bg-neutral-950 hover:border-neutral-800 hover:bg-neutral-900/50'
			)}>
			<div className='relative p-4'>
				<div className='flex items-center gap-4'>
					<Button
						onClick={() => onPlay(index, path)}
						className={cn(
							'relative flex h-12 w-12 items-center justify-center',
							isPlaying
								? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
								: 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100'
						)}
						aria-label={isPlaying ? 'Pause' : 'Play'}>
						{isPlaying ? (
							<Pause size={20} className='animate-fade-in' />
						) : (
							<Play size={20} className='translate-x-0.5' />
						)}

						{isPlaying && (
							<span className='absolute inset-0 animate-ping rounded-full bg-neutral-100 opacity-25' />
						)}
					</Button>

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
						onClick={() => onToggleFavorite(index)}
						className={cn(
							'group/fav flex h-10 w-10 items-center justify-center rounded-full',
							'transition-all duration-200',
							'hover:bg-neutral-800/80',
							isFavorite && 'bg-red-500/10'
						)}
						aria-label={
							isFavorite
								? 'Remove from favorites'
								: 'Add to favorites'
						}>
						<Heart
							fill={isFavorite ? 'currentColor' : 'none'}
							size={18}
							className={cn(
								'transition-all duration-200',
								isFavorite
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

export default SoundCard;
