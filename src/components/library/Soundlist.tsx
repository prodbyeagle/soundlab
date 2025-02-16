import { useEffect, useState } from 'react';
import SoundCard from './SoundCard';
import { getImportedSounds } from '../../lib/soundImport';

const SoundList = () => {
	const [sounds, setSounds] = useState<
		{ name: string; type: string; url: string }[]
	>([]);
	const [favorites, setFavorites] = useState<number[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSounds = async () => {
			try {
				const importedSounds = await getImportedSounds();
				setSounds(importedSounds);
			} catch (err) {
				console.error(
					'Fehler beim Abrufen der importierten Sounds:',
					err
				);
				setError('Failed to load sounds.');
			}
		};

		fetchSounds();
	}, []);

	const toggleFavorite = (index: number) => {
		setFavorites((prev) =>
			prev.includes(index)
				? prev.filter((i) => i !== index)
				: [...prev, index]
		);
	};

	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
			{error ? (
				<p className='text-center text-red-500'>{error}</p>
			) : sounds.length === 0 ? (
				<p className='text-center text-neutral-500'>
					No sounds imported yet.
				</p>
			) : (
				sounds.map((sound, index) => (
					<SoundCard
						key={index}
						index={index}
						name={sound.name}
						url={sound.url}
						isPlaying={false}
						onPlay={() => console.log('123')}
						isFavorite={favorites.includes(index)}
						onToggleFavorite={toggleFavorite}
					/>
				))
			)}
		</div>
	);
};

export default SoundList;
