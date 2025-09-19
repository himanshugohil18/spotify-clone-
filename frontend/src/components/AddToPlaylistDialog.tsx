import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Song } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddToPlaylistDialogProps {
  song: Song;
  trigger?: React.ReactNode;
}

const AddToPlaylistDialog = ({ song, trigger }: AddToPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const { playlists, addSongsToPlaylist } = usePlaylistStore();

  const handleAddToPlaylist = (playlistId: string) => {
    addSongsToPlaylist(playlistId, [song]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist to add this song to
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          {playlists.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center">No playlists available</p>
          ) : (
            playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => handleAddToPlaylist(playlist.id)}
              >
                <span className="truncate">{playlist.name}</span>
                <span className="ml-auto text-xs text-zinc-400">{playlist.songs.length} songs</span>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistDialog; 