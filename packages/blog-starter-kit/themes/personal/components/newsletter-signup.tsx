import request from 'graphql-request';
import { useRef, useState } from 'react';
import { SubscribeToNewsletterDocument } from '../generated/graphql';
import { Button } from './button';
import { useAppContext } from './contexts/appContext';

export const NewsletterSignup = () => {
	const { publication } = useAppContext();
	const [state, setState] = useState({
		submitDisabled: false,
		err: '',
		subscribed: false,
	});
	const emailInputRef = useRef<HTMLInputElement>(null);

	const isEnabled =
		!!publication?.features?.newsletter?.isEnabled ||
		!!publication?.preferences?.enabledPages?.newsletter;

	if (!publication || !isEnabled) {
		return null;
	}

	const subscribe = async () => {
		if (!emailInputRef.current || !publication.id) {
			return;
		}

		const email = emailInputRef.current.value.trim();
		if (!email) {
			setState({ ...state, err: 'Please enter an email address.' });
			return;
		}

		if (!emailInputRef.current.validity.valid) {
			setState({ ...state, err: 'Please enter a valid email address.' });
			return;
		}

		const endpoint = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
		if (!endpoint) {
			setState({ ...state, err: 'Newsletter service is unavailable right now.' });
			return;
		}

		setState({ ...state, submitDisabled: true, err: '' });

		try {
			const { subscribeToNewsletter } = await request(endpoint, SubscribeToNewsletterDocument, {
				input: {
					publicationId: publication.id.toString(),
					email,
				},
			});

			if (!subscribeToNewsletter?.status) {
				setState({
					submitDisabled: false,
					err: 'Something went wrong. Please try again.',
					subscribed: false,
				});
				return;
			}

			setState({ submitDisabled: false, err: '', subscribed: true });
		} catch (error) {
			setState({
				submitDisabled: false,
				err: 'Something went wrong. Please try again.',
				subscribed: false,
			});
		}
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (state.err) {
			setState({ ...state, err: '' });
		}
		if (event.key === 'Enter') {
			subscribe();
		}
	};

	return (
		<section className="w-full rounded-2xl border bg-transparent p-6 text-center md:p-8">
			<h2 className="text-xl font-semibold text-heading md:text-2xl">
				Subscribe to my newsletter
			</h2>
			<p className="mt-2 text-sm text-body md:text-base">
			 Notes from my ongoing battle with legacy codebases and myself, delivered to your inbox.
			</p>

			{!state.subscribed && (
				<div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
					<input
						ref={emailInputRef}
						type="email"
						placeholder="you@example.com"
						onKeyUp={handleKeyUp}
						className="w-full rounded-full border bg-transparent px-4 py-2 text-sm text-body outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:focus:border-primary-500 dark:focus:ring-primary-500/30 sm:max-w-sm"
					/>
					<Button
						label={state.submitDisabled ? 'Subscribing…' : 'Subscribe'}
						type="primary"
						onClick={subscribe}
						className="w-full sm:w-auto"
					/>
				</div>
			)}

			{state.subscribed && (
				<p className="mt-4 text-sm text-green-600 dark:text-green-400">
					Confirmation email sent to your inbox. Please confirm to complete your subscription.
				</p>
			)}
			{state.err && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{state.err}</p>}
		</section>
	);
};
