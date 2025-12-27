import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,

    toggelSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({isSoundEnabled: !get().isSoundEnabled }) 
    },

    setActiveTab: (tab) => set({activeTab:tab}),
    setSelectedUser:  (selectedUser) => set({selectedUser}),

    getAllContacts: async () => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({allContacts : res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isUserLoading: false});
        }
    },

    getMyChatParteners: async () => {
        set({isUserLoading: true});
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({chats: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isUserLoading: false});
        }
    },
}))