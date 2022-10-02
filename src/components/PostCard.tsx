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
			<p className="mt-2 block text-sm text-gray-500">{content}</p>
			<div className="block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden relative group-hover:opacity-75">
				{avatarURL && <Image src={avatarURL} alt="event image" layout="fill" />}
			</div>
			<p className="mt-2 block text-sm text-gray-500">{formatTimestamp(postTimestamp)}</p>
			<p className="block text-base font-medium text-gray-900">{handle}</p>
		</div>
	)
}

export default PostCard
