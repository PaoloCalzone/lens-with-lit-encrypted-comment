import create from 'zustand'

type State = {
	searchProfile: { profileId: string; handle: string; name: string; avatarUrl: string }
}
type Action = {
	setSearchProfile: (searchProfile: State['searchProfile']) => void
}

export const useSearchProfile = create<State & Action>(set => ({
	searchProfile: { profileId: null, handle: null, name: null, avatarUrl: null },
	setSearchProfile: searchProfile => set(state => ({ searchProfile })),
}))
