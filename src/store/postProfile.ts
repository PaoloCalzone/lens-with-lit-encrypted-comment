import create from 'zustand'

type State = {
	postProfile: { profileId: string; handle: string; name: string; avatarUrl: string }
}
type Action = {
	setPostProfile: (profile: State['postProfile']) => void
}

export const usePostProfile = create<State & Action>(set => ({
	postProfile: { profileId: '', handle: '', name: '', avatarUrl: '' },
	setPostProfile: postProfile => set(state => ({ postProfile })),
}))
