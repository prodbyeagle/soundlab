import { useRef } from 'react';
import { Play, Pause, Heart } from 'lucide-react';

type SoundCardProps = {
	index: number;
	name: string;
	path: string;
	isPlaying: boolean;
	onPlay: (index: number, path: string) => void;
	isFavorite: boolean;
	onToggleFavorite: (index: number) => void;
};

const SoundCard = ({
	index,
	name,
	path,
	isPlaying,
	onPlay,
	isFavorite,
	onToggleFavorite,
}: SoundCardProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<div className='group flex items-center justify-between rounded-lg border border-neutral-900 bg-neutral-950 p-2.5 shadow transition-all duration-200 hover:border-neutral-800 hover:bg-neutral-900/50'>
			<div className='flex items-center gap-3'>
				<button
					ref={buttonRef}
					onClick={() => onPlay(index, path)}
					className='relative flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 transition-all duration-200 hover:bg-neutral-800 hover:text-white focus:ring-1 focus:ring-neutral-700 focus:ring-offset-1 focus:ring-offset-neutral-950 focus:outline-none'
					aria-label={isPlaying ? 'Pause' : 'Play'}>
					{isPlaying ? (
						<Pause size={16} className='animate-fade-in' />
					) : (
						<Play size={16} className='translate-x-0.5' />
					)}
				</button>
				<h3 className='text-base font-medium text-neutral-100 transition-colors duration-200 group-hover:text-white'>
					{name}
				</h3>
			</div>

			<button
				onClick={() => onToggleFavorite(index)}
				className='relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:bg-neutral-800'
				aria-label={
					isFavorite ? 'Remove from favorites' : 'Add to favorites'
				}>
				<Heart
					fill={isFavorite ? 'currentColor' : 'none'}
					size={18}
					className={
						isFavorite
							? 'text-red-500'
							: 'text-neutral-400 hover:text-neutral-300'
					}
				/>
			</button>
		</div>
	);
};

export default SoundCard;
