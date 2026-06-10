import { Music } from "../models/music.model.js";


export const createMusic = async (req, res) => {
    try {
        const { title } = req.body;
        const artistId = req.user._id; // Ensure your middleware attaches the full user object

        // 1. Await the database call
        const existingMusic = await Music.findOne({
            title,
            artist: artistId
        });

        // 2. Proper check
        if (existingMusic) {
            return res.status(400).json({ message: "Song already exists for this artist" });
        }

        // 3. Create the song
        const newMusic = await Music.create({
            title,
            artist: artistId
        });

        return res.status(201).json({ 
            message: "Music created successfully", 
            data: newMusic 
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getAllMusic = async (req, res) => {
    try {
        const music = await Music.find().populate("artist", "username email");
        res.status(200).json({ data: music });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const music = await Music.findById(id);
        if (!music) return res.status(404).json({ message: "Music not found" });

        if (music.artist.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: You don't own this music" });
        }

        await Music.findByIdAndDelete(id);
        res.status(200).json({ message: "Music deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};