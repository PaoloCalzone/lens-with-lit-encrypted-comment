import { FC } from 'react'
import { GET_PUBLICATIONS } from '../../api/get-publications'
import { useQuery, gql } from '@apollo/client'
import PostCard from '../components/PostCard'

interface Props {
	postProfileId: string
}
const Posts: FC<Props> = ({ postProfileId }) => {
	const { data, loading, error } = useQuery(gql(GET_PUBLICATIONS), {
		variables: { request: { profileId: postProfileId, publicationTypes: 'POST', limit: 5 } },
	})
	console.log('Post component data:', data)
	const posts = data?.publications?.items || []
	console.log('POSTS', posts)
	if (loading)
		return (
			<div>
				<p>Loading...</p>
			</div>
		)
	if (error)
		return (
			<div>
				<p>`Error! ${error.message}`</p>
			</div>
		)

	return (
		<div>
			<ul role="list" className="flex flex-col gap-y-4">
				{data &&
					posts.map((post, index) => (
						<PostCard
							key={index}
							id={post.id}
							handle={post.profile.handle}
							content={post.metadata.content}
							postTimestamp={post.createdAt}
							avatarURL={post.profile.picture.original.url}
						/>
					))}
			</ul>
		</div>
	)
}

export default Posts
