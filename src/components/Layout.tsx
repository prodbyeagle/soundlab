import { ReactNode } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className='pt-8 h-screen'>
			<Navbar />
			<main className='p-6'>{children}</main>
		</div>
	);
};

export default Layout;
