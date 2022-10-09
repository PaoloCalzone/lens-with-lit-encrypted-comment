import create from 'zustand'

type State = {
	userProfile: { id: string; handle: string; name: string; avatarUrl: string }
}
type Action = {
	setUserProfile: (profile: State['userProfile']) => void
}

export const useUserProfile = create<State & Action>(set => ({
	userProfile: { id: null, handle: null, name: null, avatarUrl: null },
	setUserProfile: userProfile => set(state => ({ userProfile })),
}))
