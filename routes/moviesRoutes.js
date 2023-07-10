// routes/moviesRoutes.js
const express = require("express");
const multer = require("multer");
const moviesService = require("../services/moviesService");

const router = express.Router();
const upload = multer();

router.post("/movies", upload.single("image"), async (req, res) => {
  try {
    const { nama, deskripsi, tanggal, genre } = req.body;
    const imageFile = req.file;

    const moviesData = {
      nama,
      deskripsi,
      tanggal,
      genre,
      image: imageFile,
    };

    const movies = await moviesService.createmovies(moviesData);

    res.status(201).json({ message: "movies berhasil ditambahkan", movies });
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.get("/moviess", async (req, res) => {
  try {
    const moviess = await moviesService.getmoviess();
    res.json(moviess);
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.get("/moviess/:moviesId", async (req, res) => {
  try {
    const { moviesId } = req.params;
    const movies = await moviesService.getmoviesById(moviesId);

    if (!movies) {
      return res.status(404).json({ error: "movies tidak ditemukan" });
    }

    res.json(movies);
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.put("/moviess/:moviesId", upload.single("image"), async (req, res) => {
  try {
    const { moviesId } = req.params;
    const { nama, deskripsi, tanggal, genre } = req.body;
    const imageFile = req.file;

    const moviesData = {
      nama,
      deskripsi,
      tanggal,
      genre,
      image: imageFile,
    };

    const updatedmovies = await moviesService.updatemovies(moviesId, moviesData);

    if (!updatedmovies) {
      return res.status(404).json({ error: "movies tidak ditemukan" });
    }

    res.json({ message: "movies berhasil diperbarui", movies: updatedmovies });
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

router.delete("/moviess/:moviesId", async (req, res) => {
  try {
    const { moviesId } = req.params;
    const movies = await moviesService.getmoviesById(moviesId);

    if (!movies) {
      return res.status(404).json({ error: "movies tidak ditemukan" });
    }

    await moviesService.deletemovies(moviesId);

    res.json({ message: "movies berhasil dihapus" });
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
});

module.exports = router;
