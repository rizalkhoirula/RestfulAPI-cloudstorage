const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    tanggal: {
      type: Date,
      required: true,
      default: Date.now,
    },
    genre: {
      type: String,
      enum: [
        "Aksi",
        "Petualangan",
        "Komedi",
        "Drama",
        "Romantis",
        "Fantasi",
        "Horor",
        "Ilmiah",
        "Thriller",
        "Animasi",
        "Keluarga",
        "Dokumenter",
        "Musikal",
        "Misteri",
        "Sejarah",
        "Perang",
        "Kriminal",
        "Western",
        "Olahraga",
        "Fiksi ilmiah",
      ],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Movies = mongoose.model("movies", moviesSchema);

module.exports = Movies;
