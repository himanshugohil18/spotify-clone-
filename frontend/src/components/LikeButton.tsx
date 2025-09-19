import { Song } from "@/types";
import { useLikedSongsStore } from "@/stores/useLikedSongsStore";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface LikeButtonProps {
  song: Song;
  className?: string;
}

const LikeButton = ({ song, className }: LikeButtonProps) => {
  const { isLiked, addLikedSong, removeLikedSong } = useLikedSongsStore();
  const liked = isLiked(song._id);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (liked) {
      removeLikedSong(song._id);
    } else {
      addLikedSong(song);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "hover:bg-zinc-800 transition-all group-hover:opacity-100",
        liked ? "text-emerald-500" : "text-zinc-400",
        className
      )}
      onClick={toggleLike}
    >
      <Heart
        className={cn(
          "size-5",
          liked && "fill-emerald-500"
        )}
      />
    </Button>
  );
};

export default LikeButton; 