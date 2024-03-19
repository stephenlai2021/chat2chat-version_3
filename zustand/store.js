import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      mobile: false,
      loginUser: null,
      userImage: null,
      userDataStore: null,
      userCredential: null,
      selectedChatroom: null,
      setMobile: (newMobile) => set(() => ({ mobile: newMobile })),
      toggleMobile: () => set((state) => ({ mobile: !state.mobile })), 
      setUserImage: (newUserImage) => set(() => ({ image: newUserImage })),
      setLoginUser: (newLoginUser) => set(() => ({ loginUser: newLoginUser })),
      setUserDataStore: (newUserDataStore) => set(() => ({ userDataStore: newUserDataStore })),
      setUserCredential: (newUserCredential) => set(() => ({ userCredential: newUserCredential })),
      setSelectedChatroom: (newSelectedChatroom) => set(() => ({ selectedChatroom: newSelectedChatroom })),
    }),
    {
      name: "chat2chat"
    }
  )
);
