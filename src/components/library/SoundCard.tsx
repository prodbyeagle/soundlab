import { useRef } from 'react';
import { Play, Pause, Heart, HeartCrack } from 'lucide-react';

type SoundCardProps = {
	index: number;
	name: string;
	// type: string;
	url: string;
	isPlaying: boolean;
	onPlay: (index: number, url: string) => void;
	isFavorite: boolean;
	onToggleFavorite: (index: number) => void;
};

const SoundCard = ({
	index,
	name,
	// type,
	url,
	isPlaying,
	onPlay,
	isFavorite,
	onToggleFavorite,
}: SoundCardProps) => {
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<div className='flex items-center justify-between rounded-lg border border-neutral-900 bg-neutral-950 p-3 transition hover:bg-neutral-900/50'>
			<div className='flex items-center gap-4'>
				<button
					ref={buttonRef}
					onClick={() => onPlay(index, url)}
					// className='rounded-full bg-blue-500 p-2 transition hover:bg-blue-600'
					>
					{isPlaying ? <Pause size={20} /> : <Play size={20} />}
				</button>
				<div>
					<h3 className='text-lg font-medium'>{name}</h3>
					{/* <p className='text-sm text-neutral-400'>{type}</p> */}
				</div>
			</div>

			<button
				onClick={() => onToggleFavorite(index)}
				className={`relative rounded-full p-2 transition ${
					isFavorite
						? 'text-red-500 hover:text-red-400'
						: 'text-neutral-400 hover:text-neutral-300'
				}`}>
				<span className='absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-hover:opacity-0'>
					<Heart
						fill={isFavorite ? 'currentColor' : 'none'}
						size={22}
					/>
				</span>
				<span className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
					<HeartCrack size={22} />
				</span>
			</button>
		</div>
	);
};

export default SoundCard;
