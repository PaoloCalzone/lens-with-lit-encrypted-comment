import { FC, useState, useEffect } from 'react'
import { GET_PUBLICATIONS } from '../../api/get-publications'
import { useQuery, gql } from '@apollo/client'
import { usePublication } from '../store/publication'
import PostCard from '../components/PostCard'

interface Props {
	userProfileId: string
}
const Posts: FC<Props> = ({ userProfileId }) => {
	const { data, loading, error } = useQuery(gql(GET_PUBLICATIONS), {
		variables: { request: { profileId: userProfileId, publicationTypes: 'POST', limit: 5 } },
	})
	const [publication, setPublication] = usePublication(state => [state.publication, state.setPublication])
	// Array with first all posts from query, then only the selected post by user
	const [isShown, setIsShown] = useState([])
	const posts = data?.publications?.items || []

	useEffect(() => {
		if (data) {
			const postsIds = []
			data.publications?.items?.map(item => postsIds.push(item.id))
			setIsShown(postsIds)
		}
	}, [data])

	function handleSelect(id) {
		const selectedPostId = isShown.filter(postId => postId === id)
		setPublication(posts.filter(post => post.id === selectedPostId[0]))
		setIsShown(selectedPostId)
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
									avatarURL={post.profile?.picture?.original?.url}
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
