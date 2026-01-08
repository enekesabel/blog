import { useAppContext } from './contexts/appContext';

export const Footer = () => {
	const { publication } = useAppContext();

	return (
		<footer className="border-t pt-10 text-sm text-muted">
			&copy; {new Date().getFullYear()} - {publication.title}
		</footer>
	);
};
