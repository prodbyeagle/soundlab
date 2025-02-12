import { createContext, useState, ReactNode } from 'react';

interface Sound {
	name: string;
	path: string;
}

interface SoundContextProps {
	sounds: Sound[];
	addSound: (sound: Sound) => void;
}

const SoundContext = createContext<SoundContextProps | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
	const [sounds, setSounds] = useState<Sound[]>([]);

	const addSound = (sound: Sound) => setSounds((prev) => [...prev, sound]);

	return (
		<SoundContext.Provider value={{ sounds, addSound }}>
			{children}
		</SoundContext.Provider>
	);
};

export default SoundContext;
