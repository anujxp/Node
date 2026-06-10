import { Album } from "../models/album.model.js";

// Create Album (Only Artists)
export const createAlbum = async (req, res) => {
    try {
        const { title, musicIds } = req.body;
        const artistId = req.user._id;

        const album = await Album.create({
            title,
            artist: artistId,
            songs: musicIds // Assuming musicIds is an array of IDs
        });

        res.status(201).json({ message: "Album created successfully", data: album });
    } catch (error) {
        res.status(500).json({ message: "Error creating album", error: error.message });
    }
};

// Get All Albums (Everyone)
export const getAllAlbums = async (req, res) => {
    try {
        // We populate the 'music' field so the frontend sees the songs in the album
        const albums = await Album.find().populate("songs", "title").populate("artist", "username");
        res.status(200).json({ data: albums });
    } catch (error) {
        res.status(500).json({ message: "Error fetching albums", error: error.message });
    }
};