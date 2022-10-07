import { useCallback, useState, useRef } from 'react'
import { gql, useQuery } from '@apollo/client'
import { SEARCH_PROFILES } from '../../api/search-profiles'

const Search = () => {
	const searchRef = useRef(null)
	const [active, setActive] = useState(false)
	const [profile, setProfile] = useState([])
	const [loadingState, setLoadingState] = useState('loading')
	const [searchString, setSearchString] = useState('')
	const { loading, error, data } = useQuery(gql(SEARCH_PROFILES), {
		variables: { query: searchString, type: 'PROFILE' },
	})
	console.log('DATA', data && data)

	const onFocus = useCallback(() => {
		setActive(true)
		window.addEventListener('click', onClick)
	}, [])

	const onClick = useCallback(event => {
		if (searchRef.current && !searchRef.current.contains(event.target)) {
			setActive(false)
			window.removeEventListener('click', onClick)
		}
	}, [])

	const selectProfile = (id, handle) => {
		console.log('Profile id is:', id)
		setSearchString(handle)
		// zustand to populate profile data
	}
	// TODO add button to on submit set profile in store
	return (
		<div className="" ref={searchRef}>
			<input
				className=""
				onChange={e => setSearchString(e.target.value)}
				onFocus={onFocus}
				placeholder="Search posts"
				type="text"
				value={searchString}
			/>
			{active && data && data.search.items.length > 0 && (
				<ul className="">
					{data.search.items.map((profile, id) => (
						<li className="" key={id} onClick={() => selectProfile(profile.profileId, profile.handle)}>
							<div>
								<a>{profile.handle}</a>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Search
