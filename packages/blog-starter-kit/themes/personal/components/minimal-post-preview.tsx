import Link from 'next/link';
import { User } from '../generated/graphql';
import { DateFormatter } from './date-formatter';

type Author = Pick<User, 'name'>;

type Props = {
	title: string;
	date: string;
	author: Author;
	slug: string;
	commentCount: number;
	brief?: string;
};

export const MinimalPostPreview = ({ title, date, slug, commentCount, brief }: Props) => {
	const postURL = `/${slug}`;

	return (
		<section className="flex flex-col items-start gap-2">
			<h2 className="text-lg leading-normal tracking-normal text-heading">
				<Link href={postURL}>{title}</Link>
			</h2>
			{brief && (
				<p className="text-sm text-body line-clamp-2">
					{brief}
				</p>
			)}
			<p className="flex flex-row items-center gap-2">
				<Link href={postURL} className="text-sm text-muted no-underline">
					<DateFormatter dateString={date} />
				</Link>
				{commentCount > 2 && (
					<>
						<span>&middot;</span>
						<Link href={postURL} className="text-sm text-muted no-underline">
							{commentCount} comments
						</Link>
					</>
				)}
			</p>
		</section>
	);
};
