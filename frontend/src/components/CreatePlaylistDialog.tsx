import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Song } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreatePlaylistDialogProps {
  songs?: Song[];
  trigger?: React.ReactNode;
}

const CreatePlaylistDialog = ({ songs = [], trigger }: CreatePlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const createPlaylist = usePlaylistStore((state) => state.createPlaylist);

  const handleCreatePlaylist = () => {
    if (!name.trim()) return;
    createPlaylist(name, songs);
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Give your playlist a name. You can add songs to it later.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePlaylist} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog; 