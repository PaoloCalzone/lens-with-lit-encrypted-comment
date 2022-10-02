import { FC } from 'react'
import Image from 'next/image'
import formatTimestamp from '../../utils/formatTimestamp'

interface Props {
	id: string
	key?: string
	handle: string
	postTimestamp: string
	content: string
	avatarURL?: string
}
const PostCard: FC<Props> = ({ key, id, handle, content, postTimestamp, avatarURL }) => {
	return (
		<div className="group relative clickable-card rounded-lg focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500">
			<div className="flex justify-between pb-4 space-x-1.5">
				<div className="flex items-center space-x-3">
					{avatarURL && (
						<Image
							src={avatarURL}
							alt="event image"
							className="rounded-full border"
							loading="lazy"
							width={40}
							height={40}
						/>
					)}

					<p className="block text-base font-medium text-gray-900">{handle}</p>
				</div>
			</div>
			<p className="mt-2 block text-sm text-gray-500">{content}</p>
			<p className="mt-2 block text-sm text-gray-500">{formatTimestamp(postTimestamp)}</p>
		</div>
	)
}

export default PostCard
