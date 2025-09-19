import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Heart, Pause, Play, Plus } from "lucide-react";
import { formatDuration } from "@/pages/album/AlbumPage";
import { useLikedSongsStore } from "@/stores/useLikedSongsStore";
import LikeButton from "@/components/LikeButton";
import CreatePlaylistDialog from "@/components/CreatePlaylistDialog";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";

const LikedSongsPage = () => {
	const { likedSongs } = useLikedSongsStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	const handlePlayAll = () => {
		if (likedSongs.length === 0) return;

		const isCurrentPlaylistPlaying = likedSongs.some((song) => song._id === currentSong?._id);
		if (isCurrentPlaylistPlaying) {
			togglePlay();
		} else {
			playAlbum(likedSongs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		playAlbum(likedSongs, index);
	};

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-emerald-600/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none transition-all duration-500'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex p-6 gap-6 pb-8'>
							<div className='w-[240px] h-[240px] shadow-2xl rounded bg-gradient-to-br from-emerald-600/30 to-emerald-800/30 flex items-center justify-center transition-all duration-300 hover:shadow-emerald-500/20'>
								<Heart className="w-1/2 h-1/2 text-white animate-pulse" />
							</div>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium text-zinc-400'>Playlist</p>
								<h1 className='text-7xl font-bold my-4 text-white drop-shadow-lg'>Liked Songs</h1>
								<div className='flex items-center gap-2 text-sm text-zinc-400'>
									<span className='font-medium text-white'>{likedSongs.length} songs</span>
									<span>•</span>
									<span>Your personal collection</span>
								</div>
							</div>
						</div>

						{/* play button and create playlist */}
						<div className='px-6 pb-4 flex items-center gap-6'>
							<Button
								onClick={handlePlayAll}
								size='icon'
								className='w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 
                hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20'
								disabled={likedSongs.length === 0}
							>
								{isPlaying && likedSongs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-7 w-7 text-black' />
								) : (
									<Play className='h-7 w-7 text-black' />
								)}
							</Button>
							<CreatePlaylistDialog songs={likedSongs} />
						</div>

						{/* Table Section */}
						<div className='bg-black/20 backdrop-blur-sm rounded-lg mx-6 mb-6'>
							{/* table header */}
							<div
								className='grid grid-cols-[16px_4fr_2fr_1fr_48px_48px] gap-4 px-10 py-3 text-sm 
            text-zinc-400 border-b border-white/5 sticky top-0 bg-black/20 backdrop-blur-sm'
							>
								<div>#</div>
								<div>Title</div>
								<div>Album</div>
								<div>
									<Clock className='h-4 w-4' />
								</div>
								<div></div>
								<div></div>
							</div>

							{/* songs list */}
							<div className='px-6'>
								{likedSongs.length === 0 ? (
									<div className="py-16 text-center text-zinc-400">
										<Heart className="h-12 w-12 mx-auto mb-4 text-emerald-500/50" />
										<p className="text-xl mb-2 font-medium">No liked songs yet</p>
										<p className="text-sm">Save songs by clicking the heart icon</p>
									</div>
								) : (
									<div className='space-y-2 py-4'>
										{likedSongs.map((song, index) => {
											const isCurrentSong = currentSong?._id === song._id;
											return (
												<div
													key={song._id}
													onClick={() => handlePlaySong(index)}
													className={`grid grid-cols-[16px_4fr_2fr_1fr_48px_48px] gap-4 px-4 py-2 text-sm 
													text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
													transition-all duration-200 ${isCurrentSong ? 'bg-white/10' : ''}`}
												>
													<div className='flex items-center justify-center'>
														{isCurrentSong && isPlaying ? (
															<div className='size-4 text-emerald-500 animate-pulse'>♫</div>
														) : (
															<span className='group-hover:hidden'>{index + 1}</span>
														)}
														{!isCurrentSong && (
															<Play className='h-4 w-4 hidden group-hover:block text-white' />
														)}
													</div>

													<div className='flex items-center gap-3'>
														<img 
															src={song.imageUrl} 
															alt={song.title} 
															className='size-10 rounded-sm shadow-lg transition-transform duration-200 group-hover:scale-105' 
														/>

														<div>
															<div className={`font-medium ${isCurrentSong ? 'text-emerald-500' : 'text-white'}`}>
																{song.title}
															</div>
															<div className="text-zinc-400">{song.artist}</div>
														</div>
													</div>
													<div className='flex items-center text-zinc-400'>{song.albumId || "Single"}</div>
													<div className='flex items-center text-zinc-400'>{formatDuration(song.duration)}</div>
													<div className='flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
														<LikeButton song={song} />
													</div>
													<div className='flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
														<AddToPlaylistDialog song={song} />
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default LikedSongsPage; 