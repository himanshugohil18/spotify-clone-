import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Song } from "@/types";

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: string;
}

interface PlaylistStore {
  playlists: Playlist[];
  createPlaylist: (name: string, songs: Song[]) => void;
  addSongsToPlaylist: (playlistId: string, songs: Song[]) => void;
  removeSongsFromPlaylist: (playlistId: string, songIds: string[]) => void;
  deletePlaylist: (playlistId: string) => void;
}

export const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: [],
      createPlaylist: (name, songs) => {
        const newPlaylist: Playlist = {
          id: Date.now().toString(),
          name,
          songs,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));
      },
      addSongsToPlaylist: (playlistId, songs) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, songs: [...playlist.songs, ...songs] }
              : playlist
          ),
        }));
      },
      removeSongsFromPlaylist: (playlistId, songIds) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  songs: playlist.songs.filter((song) => !songIds.includes(song._id)),
                }
              : playlist
          ),
        }));
      },
      deletePlaylist: (playlistId) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== playlistId),
        }));
      },
    }),
    {
      name: "playlists-storage",
    }
  )
); 