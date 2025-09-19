import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
	try {
		if (!file || !file.tempFilePath) {
			throw new Error("Invalid file");
		}
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary: " + error.message);
	}
};

export const createSong = async (req, res, next) => {
	try {
		console.log("Creating song with files:", req.files);
		console.log("Creating song with body:", req.body);

		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload both audio and image files" });
		}

		const { title, artist, albumId, duration } = req.body;
		
		if (!title || !artist) {
			return res.status(400).json({ message: "Please provide title and artist" });
		}

		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration: duration || 0,
			albumId: albumId || null,
		});

		await song.save();

		// if song belongs to an album, update the album's songs array
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}
		res.status(201).json(song);
	} catch (error) {
		console.log("Error in createSong", error);
		res.status(500).json({ message: error.message });
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;

		const song = await Song.findById(id);

		// if song belongs to an album, update the album's songs array
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		console.log("Creating album with files:", req.files);
		console.log("Creating album with body:", req.body);

		const { title, artist, releaseYear } = req.body;
		
		if (!req.files || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload an album cover image" });
		}

		if (!title || !artist) {
			return res.status(400).json({ message: "Please provide title and artist" });
		}

		const imageFile = req.files.imageFile;
		const imageUrl = await uploadToCloudinary(imageFile);

		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear: releaseYear || new Date().getFullYear(),
			songs: [],
		});

		await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Error in createAlbum", error);
		res.status(500).json({ message: error.message });
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
