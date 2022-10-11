import create from 'zustand'

type State = {
	publication: { id: string; handle: string; name: string; avatarUrl: string }
}
type Action = {
	setPublication: (profile: State['publication']) => void
}

export const usePublication = create<State & Action>(set => ({
	publication: { id: null, handle: null, name: null, avatarUrl: null },
	setPublication: publication => set(state => ({ publication })),
}))
