import create from 'zustand'

type State = {
	profile: { id: String; handle: String; name: String; avatarUrl: String }
}
type Action = {
	setProfile: (profile: State['profile']) => void
}

export const useProfile = create<State & Action>(set => ({
	profile: { id: '', handle: '', name: '', avatarUrl: '' },
	setProfile: profile => set(state => ({ profile })),
}))
