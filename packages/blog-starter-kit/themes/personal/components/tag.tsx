import Link from 'next/link';

type Props = {
	slug: string;
	name?: string;
};

/**
 * Tag component with bracket style [#tag]
 * - Brackets and hashtag use primary color
 * - Tag name uses muted color
 * - Only tag name gets dashed underline on hover (not brackets/hashtag)
 * - Entire tag is clickable as a single link
 */
export const Tag = ({ slug, name }: Props) => {
	const displayName = name || slug;

	return (
		<Link
			href={`/tag/${slug}`}
			className="group inline-flex items-center"
		>
			<span className="text-primary-500">[#</span>
			<span className="text-muted group-hover:underline group-hover:decoration-dashed group-hover:underline-offset-4">
				{displayName}
			</span>
			<span className="text-primary-500">]</span>
		</Link>
	);
};
