import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Heart, Music } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLikedSongsStore } from "@/stores/useLikedSongsStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { likedSongs } = useLikedSongsStore();
	const { playlists } = usePlaylistStore();
	const location = useLocation();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}
			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							}),
							location.pathname === "/" && "bg-zinc-800"
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								}),
								location.pathname === "/chat" && "bg-zinc-800"
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
						</Link>

						<Link
							to={"/liked"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								}),
								location.pathname === "/liked" && "bg-zinc-800"
							)}
						>
							<Heart className='mr-2 size-5' />
							<span className='hidden md:inline'>Liked Songs</span>
							<span className="ml-auto text-xs text-zinc-400 hidden md:inline">{likedSongs.length}</span>
						</Link>
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-2'>
						<Library className='size-5 text-zinc-400' />
						<span className='hidden md:inline text-zinc-400'>Your Library</span>
					</div>
					<CreatePlaylistDialog />
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-4'>
						{/* Playlists section */}
						{playlists.length > 0 && (
							<div className="space-y-2">
								<h3 className="text-sm font-medium text-zinc-400 px-2">Playlists</h3>
								{playlists.map((playlist) => (
									<Link
										key={playlist.id}
										to={`/playlist/${playlist.id}`}
										className={cn(
											buttonVariants({
												variant: "ghost",
												className: "w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800",
											}),
											location.pathname === `/playlist/${playlist.id}` && "bg-zinc-800 text-white"
										)}
									>
										<Music className='mr-2 size-5' />
										<span className='hidden md:inline truncate'>{playlist.name}</span>
										<span className="ml-auto text-xs text-zinc-400 hidden md:inline">{playlist.songs.length}</span>
									</Link>
								))}
							</div>
						)}

						{/* Albums section */}
						<div className="space-y-2">
							<h3 className="text-sm font-medium text-zinc-400 px-2">Albums</h3>
							{isLoading ? (
								<PlaylistSkeleton />
							) : (
								albums.map((album) => (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className={cn(
											'p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer',
											location.pathname === `/albums/${album._id}` && "bg-zinc-800"
										)}
									>
										<img
											src={album.imageUrl}
											alt='Playlist img'
											className='size-12 rounded-md flex-shrink-0 object-cover'
										/>

										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium truncate'>{album.title}</p>
											<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
										</div>
									</Link>
								))
							)}
						</div>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default LeftSidebar;
