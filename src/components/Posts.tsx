import { FC, useState, useEffect } from 'react'
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
	const [isShown, setIsShown] = useState([])
	const posts = data?.publications?.items || []

	useEffect(() => {
		if (data) {
			const ids = []
			data.publications?.items?.map(item => ids.push(item.id))
			setIsShown(ids)
		}
	}, [data])

	function handleSelect(id) {
		const selectedPost = isShown.filter(postId => postId === id)
		setIsShown(selectedPost)
	}
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
						<div key={index} onClick={() => handleSelect(post.id)}>
							{isShown.includes(post.id) && (
								<PostCard
									id={post.id}
									handle={post.profile.handle}
									content={post.metadata.content}
									postTimestamp={post.createdAt}
									avatarURL={post.profile.picture.original.url}
									isShown={isShown}
								/>
							)}
						</div>
					))}
			</ul>
		</div>
	)
}

export default Posts
