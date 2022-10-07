/* eslint-disable no-unused-vars */
import create from 'zustand'

interface PublicationState {
	publication: object
	setPublication: (publication: object) => void
}

export const usePublicationStore = create<PublicationState>(set => ({
	publication: { id: '', handle: '', content: '', postTimestamp: '', avatarURL: '' },
	setPublication: publication => set({ publication }),
}))
