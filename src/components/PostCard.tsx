import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { age, formatTimestamp } from '../../utils/formatTimestamp'
import PublishComment from '../components/PublishComment'

interface Props {
	id: string
	key?: string
	handle: string
	postTimestamp: string
	content: string
	avatarURL?: string
	isShown: Array<string>
}
const PostCard: FC<Props> = ({ key, id, handle, content, postTimestamp, avatarURL, isShown }) => {
	console.log('Date', postTimestamp)
	return (
		<div>
			<div className="group relative mt-6 clickable-card rounded-lg border border-slate-200 bg-white  focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500">
				<article className="p-5">
					<div className="flex justify-between pb-4 space-x-1.5">
						<div className="flex items-center space-x-3">
							{avatarURL && (
								<Image
									src={avatarURL}
									alt="event image"
									className=" bg-gray-200 rounded-full border dark:border-gray-700/80"
									loading="lazy"
									width={40}
									height={40}
								/>
							)}
							<div>
								<div className="flex gap-1 items-center max-w-sm truncate text-slate-500">
									@{handle}
								</div>
							</div>
						</div>
					</div>
					<div className="ml-[53px]">
						<div className="break-words">
							<div className="whitespace-pre-wrap">
								<span>{content}</span>
							</div>
							<div className="mt-2 block text-sm text-gray-500">{age(postTimestamp)}</div>
						</div>
						{/* <p className="mt-2 block text-sm text-gray-500">{formatTimestamp(postTimestamp)}</p> */}
					</div>
				</article>
			</div>
			{isShown.length === 1 && <PublishComment />}
		</div>
	)
}

export default PostCard
