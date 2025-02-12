import { useState } from 'react';

interface SampleItemProps {
	sound: { name: string; path: string };
}

const SampleItem = ({ sound }: SampleItemProps) => {
	const [audio] = useState(new Audio(sound.path));

	return (
		<div className='flex justify-between rounded bg-neutral-800 p-4'>
			<span>{sound.name}</span>
			<button
				className='rounded bg-blue-500 p-2'
				onClick={() => audio.play()}>
				▶
			</button>
		</div>
	);
};

export default SampleItem;
