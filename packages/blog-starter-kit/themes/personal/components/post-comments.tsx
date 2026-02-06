import { markdownToHtml } from '@starter-kit/utils/renderer/markdownToHtml';
import { resizeImage } from '@starter-kit/utils/image';
import { Button } from './button';
import { useAppContext } from './contexts/appContext';
import { DateFormatter } from './date-formatter';
import { DEFAULT_AVATAR } from '../utils/const';

export const PostComments = () => {
	const { post } = useAppContext();

	if (!post) {
		return null;
	}

	const commentsDisabled = post.preferences?.disableComments;
	const comments = post.comments?.edges ?? [];
	const totalComments = post.comments?.totalDocuments ?? post.responseCount ?? 0;
	const discussionUrl = `https://hashnode.com/discussions/post/${post.id}`;

	return (
		<section className="w-full border-t pt-8">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-lg font-semibold text-heading">
					Comments {totalComments > 0 && <span className="text-muted">({totalComments})</span>}
				</h2>
				<Button
					as="a"
					href={discussionUrl}
					target="_blank"
					rel="noopener noreferrer"
					type="outline"
					label="Add a comment"
					className="w-full sm:w-auto"
				/>
			</div>

			{commentsDisabled && (
				<p className="mt-3 text-sm text-muted">Comments are disabled for this post.</p>
			)}

			{!commentsDisabled && comments.length === 0 && (
				<p className="mt-3 text-sm text-muted">No comments yet. Be the first to share your thoughts.</p>
			)}

			{!commentsDisabled && comments.length > 0 && (
				<div className="mt-6 flex flex-col gap-6">
					{comments.map((edge) => {
						const comment = edge.node;
						const author = comment.author;
						const avatarSrc = resizeImage(
							author.profilePicture || DEFAULT_AVATAR,
							{ w: 160, h: 160, c: 'face' },
							DEFAULT_AVATAR,
						);

						return (
							<article key={comment.id} className="rounded-2xl border p-4 md:p-5">
								<div className="flex items-center gap-3">
									<img
										src={avatarSrc}
										alt={author.name}
										className="h-8 w-8 rounded-full"
									/>
									<div className="flex flex-col">
										<a
											href={`https://hashnode.com/@${author.username}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm font-semibold text-heading"
										>
											{author.name}
										</a>
										<span className="text-xs text-muted">
											<DateFormatter dateString={comment.dateAdded} />
										</span>
									</div>
								</div>
								<div
									className="prose prose-sm mt-3 max-w-none text-body dark:prose-invert"
									dangerouslySetInnerHTML={{
										__html: markdownToHtml(comment.content.markdown || ''),
									}}
								/>
							</article>
						);
					})}
				</div>
			)}
		</section>
	);
};
