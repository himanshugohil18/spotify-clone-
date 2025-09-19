import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, Plus } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLikedSongsStore } from "@/stores/useLikedSongsStore";
import LikeButton from "@/components/LikeButton";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";

export const formatDuration = (duration: number) => {
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const { likedSongs } = useLikedSongsStore();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading || !currentAlbum) {
		return <div>Loading...</div>;
	}

	const handlePlayAll = () => {
		if (currentAlbum.songs.length === 0) return;

		const isCurrentAlbumPlaying = currentAlbum.songs.some((song) => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) {
			togglePlay();
		} else {
			playAlbum(currentAlbum.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		playAlbum(currentAlbum.songs, index);
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
								<img
									src={currentAlbum.imageUrl}
									alt={currentAlbum.title}
									className='w-full h-full object-cover rounded'
								/>
							</div>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium text-zinc-400'>Album</p>
								<h1 className='text-7xl font-bold my-4 text-white drop-shadow-lg'>{currentAlbum.title}</h1>
								<div className='flex items-center gap-2 text-sm text-zinc-400'>
									<span className='font-medium text-white'>{currentAlbum.artist}</span>
									<span>•</span>
									<span>{currentAlbum.songs.length} songs</span>
								</div>
							</div>
						</div>

						{/* play button */}
						<div className='px-6 pb-4'>
							<Button
								onClick={handlePlayAll}
								size='icon'
								className='w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 
                hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20'
								disabled={currentAlbum.songs.length === 0}
							>
								{isPlaying && currentAlbum.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-7 w-7 text-black' />
								) : (
									<Play className='h-7 w-7 text-black' />
								)}
							</Button>
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
								<div className='space-y-2 py-4'>
									{currentAlbum.songs.map((song, index) => {
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
												<div className='flex items-center text-zinc-400'>{currentAlbum.title}</div>
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
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default AlbumPage;
