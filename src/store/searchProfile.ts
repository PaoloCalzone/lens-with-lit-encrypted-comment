import create from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	searchProfile: { profileId: string; handle: string; name: string; avatarUrl: string }
}
type Action = {
	setSearchProfile: (searchProfile: State['searchProfile']) => void
}

export const useSearchProfile = create(
	persist<State & Action>(
		set => ({
			searchProfile: { profileId: null, handle: null, name: null, avatarUrl: null },
			setSearchProfile: searchProfile => set(state => ({ searchProfile })),
		}),
		{ name: 'searchProfile.lenster.store' }
	)
)
