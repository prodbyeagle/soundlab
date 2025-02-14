import { useRef } from 'react';
import { Play, Pause, Heart } from 'lucide-react';

type SoundCardProps = {
	index: number;
	name: string;
	url: string;
	isPlaying: boolean;
	onPlay: (index: number, url: string) => void;
	isFavorite: boolean;
	onToggleFavorite: (index: number) => void;
};

const SoundCard = ({
	index,
	name,
	url,
	isPlaying,
	onPlay,
	isFavorite,
	onToggleFavorite,
}: SoundCardProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<div className='group relative overflow-hidden rounded-xl border border-neutral-900 bg-neutral-950 shadow-lg transition-all duration-300 hover:border-neutral-800 hover:bg-neutral-900/50 hover:shadow-xl'>
			<div className='flex items-center justify-between p-4'>
				<div className='flex items-center gap-5'>
					<button
						ref={buttonRef}
						onClick={() => onPlay(index, url)}
						className='relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-neutral-400 transition-all duration-300 hover:bg-neutral-800 hover:text-white focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-neutral-950 focus:outline-none'
						aria-label={isPlaying ? 'Pause' : 'Play'}>
						{isPlaying ? (
							<Pause size={24} className='animate-fade-in' />
						) : (
							<Play size={24} className='translate-x-0.5' />
						)}
					</button>
					<div className='flex flex-col'>
						<h3 className='text-lg font-medium text-neutral-100 transition-colors duration-300 group-hover:text-white'>
							{name}
						</h3>
						<p className='text-sm text-neutral-400'>
							Click to {isPlaying ? 'pause' : 'play'}
						</p>
					</div>
				</div>

				<button
					onClick={() => onToggleFavorite(index)}
					className='group/heart relative h-12 w-12 rounded-full p-2 transition-all duration-300 hover:bg-neutral-800'
					aria-label={
						isFavorite
							? 'Remove from favorites'
							: 'Add to favorites'
					}>
					<div
						className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
							isFavorite
								? 'opacity-100'
								: 'opacity-100 group-hover/heart:opacity-0'
						}`}>
						<Heart
							fill={isFavorite ? 'currentColor' : 'none'}
							size={28}
							className={
								isFavorite
									? 'text-red-500'
									: 'text-neutral-400 hover:text-neutral-300'
							}
						/>
					</div>
					<div
						className={`absolute inset-0 flex items-center justify-center text-neutral-400 transition-all duration-300 ${
							isFavorite
								? 'opacity-0 group-hover/heart:opacity-100'
								: 'opacity-0 group-hover/heart:opacity-100'
						}`}>
						<Heart size={28} className='text-red-500' />
					</div>
				</button>
			</div>
		</div>
	);
};

export default SoundCard;
