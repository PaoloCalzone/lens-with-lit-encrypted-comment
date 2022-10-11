import { useCallback, useState, useRef } from 'react'
import { gql, useQuery } from '@apollo/client'
import { SEARCH_PROFILES } from '../../api/search-profiles'
import { useSearchProfile } from '../store/searchProfile'
import { usePublication } from '../store/publication'

const Search = () => {
	const searchRef = useRef(null)
	const [active, setActive] = useState(false)
	const [searchProfile, setSearchProfile] = useSearchProfile(state => [state.searchProfile, state.setSearchProfile])

	const [searchString, setSearchString] = useState('')
	const { loading, error, data } = useQuery(gql(SEARCH_PROFILES), {
		variables: { query: searchString, type: 'PROFILE' },
	})
	console.log('DATA from search component', data && data)

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

	const selectProfile = profile => {
		console.log('Selected Profile is:', profile)
		setSearchProfile(profile)
		setSearchString('@' + profile.handle)
	}

	return (
		<div className="relative" ref={searchRef}>
			<input
				className="box-border border-1 text-lg p-4 w-full "
				onChange={e => setSearchString(e.target.value)}
				onFocus={onFocus}
				placeholder="Search posts"
				type="text"
				value={searchString}
			/>
			{active && data && data.search.items.length > 0 && (
				<ul className=" list-none sm:rounded-xl border overflow-y-auto my-2 p-0 max-h-[50vh] max-w-md absolute top-full bg-white left-0 right-0 z-50">
					{data.search.items.map((profile, id) => (
						<li
							className="py-4  text-lg cursor-pointer hover:bg-slate-100"
							key={id}
							onClick={() => selectProfile(profile)}
						>
							<div className="flex center-items">
								{profile.picture ? (
									<picture>
										<img
											src={profile.picture.original?.url || null}
											alt="event image"
											className=" bg-gray-200 rounded-full border  w-10 h-10"
											loading="lazy"
										/>
									</picture>
								) : null}

								<div className="flex-col items-center  ml-6">
									<div>{profile.name}</div>
									<div className="text-base">@{profile.handle}</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Search
