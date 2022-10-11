import create from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
	userProfile: { id: string; handle: string; name: string; avatarUrl: string }
}
type Action = {
	setUserProfile: (userProfile: State['userProfile']) => void
}

export const useUserProfile = create(
	persist<State & Action>(
		set => ({
			userProfile: { id: null, handle: null, name: null, avatarUrl: null },
			setUserProfile: userProfile => set(state => ({ userProfile })),
		}),
		{ name: 'lenster.store' }
	)
)
