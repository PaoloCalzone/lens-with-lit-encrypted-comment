import { useCallback, useState, useRef } from 'react'
import { gql, useQuery } from '@apollo/client'
import { SEARCH_PROFILES } from '../../api/search-profiles'

const Search = () => {
	const searchRef = useRef(null)
	const [active, setActive] = useState(false)
	const [profile, setProfile] = useState([])
	const [loadingState, setLoadingState] = useState('loading')
	const [searchString, setSearchString] = useState('@paolocalzone')
	const { loading, error, data } = useQuery(gql(SEARCH_PROFILES), {
		variables: { query: searchString, type: 'PROFILE' },
	})

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
					{data.search.items.map((item, id) => (
						<li className="" key={id}>
							<div>
								<a>{item.handle}</a>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Search
