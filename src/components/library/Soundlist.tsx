import { useState, useRef } from 'react';
import SoundCard from './SoundCard';

const demoSounds = [
	{ name: 'Kick 808', type: '808', url: '/sounds/kick808.mp3' },
	{ name: 'Snare Classic', type: 'Snare', url: '/sounds/snare-classic.mp3' },
	{ name: 'HiHat Open', type: 'HiHat', url: '/sounds/hihat-open.mp3' },
];

const SoundList = () => {
	const [playing, setPlaying] = useState<number | null>(null);
	const [favorites, setFavorites] = useState<number[]>([]);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const togglePlay = (index: number, url: string) => {
		if (playing === index) {
			audioRef.current?.pause();
			setPlaying(null);
		} else {
			if (audioRef.current) {
				audioRef.current.src = url;
				audioRef.current.play();
			} else {
				audioRef.current = new Audio(url);
				audioRef.current.play();
			}
			setPlaying(index);
		}
	};

	const toggleFavorite = (index: number) => {
		setFavorites((prev) =>
			prev.includes(index)
				? prev.filter((i) => i !== index)
				: [...prev, index]
		);
	};

	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
			<audio ref={audioRef} onEnded={() => setPlaying(null)} />
			{demoSounds.map((sound, index) => (
				<SoundCard
					key={index}
					index={index}
					name={sound.name}
					url={sound.url}
					isPlaying={playing === index}
					onPlay={togglePlay}
					isFavorite={favorites.includes(index)}
					onToggleFavorite={toggleFavorite}
				/>
			))}
		</div>
	);
};

export default SoundList;
