import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song } from "@/types";

interface LikedSongsStore {
  likedSongs: Song[];
  addLikedSong: (song: Song) => void;
  removeLikedSong: (songId: string) => void;
  isLiked: (songId: string) => boolean;
}

export const useLikedSongsStore = create<LikedSongsStore>()(
  persist(
    (set, get) => ({
      likedSongs: [],
      addLikedSong: (song) => {
        set((state) => ({
          likedSongs: [...state.likedSongs, song],
        }));
      },
      removeLikedSong: (songId) => {
        set((state) => ({
          likedSongs: state.likedSongs.filter((song) => song._id !== songId),
        }));
      },
      isLiked: (songId) => {
        return get().likedSongs.some((song) => song._id === songId);
      },
    }),
    {
      name: "liked-songs-storage",
    }
  )
); 