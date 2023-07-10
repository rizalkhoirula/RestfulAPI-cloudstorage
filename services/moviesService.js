const Film = require("../models/moviesModels");
const { Storage } = require("@google-cloud/storage");

const storageBucket = "nama_bucket_storage"; // Ganti dengan nama bucket penyimpanan Anda di GCP
const gcStorage = new Storage({
  keyFilename: "path/ke/kunci_akses.json", // Ganti dengan lokasi kunci akses JSON Anda
  projectId: "id_proyek_gcp", // Ganti dengan ID proyek GCP Anda
});

const createFilm = async (filmData) => {
  try {
    const { nama, deskripsi, tanggal, genre, image } = filmData;

    // Upload file gambar ke Google Cloud Storage
    const bucket = gcStorage.bucket(storageBucket);
    const fileName = `${Date.now()}_${image.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });

    await new Promise((resolve, reject) => {
      stream.on("error", (error) => {
        console.error("Gagal mengunggah gambar", error);
        reject("Gagal mengunggah gambar");
      });

      stream.on("finish", () => {
        resolve();
      });

      stream.end(image.buffer);
    });

    // Simpan data film ke MongoDB
    const film = new Film({
      nama,
      deskripsi,
      tanggal,
      genre,
      image: `https://storage.googleapis.com/${storageBucket}/${fileName}`,
    });

    await film.save();

    return film;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const getFilms = async () => {
  try {
    const films = await Film.find();
    return films;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const getFilmById = async (filmId) => {
  try {
    const film = await Film.findById(filmId);
    return film;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const updateFilm = async (filmId, filmData) => {
  try {
    const { nama, deskripsi, tanggal, genre, image } = filmData;

    // Upload file gambar ke Google Cloud Storage jika ada perubahan gambar
    let imageUrl;
    if (image) {
      const bucket = gcStorage.bucket(storageBucket);
      const fileName = `${Date.now()}_${image.originalname}`;
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: image.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        stream.on("error", (error) => {
          console.error("Gagal mengunggah gambar", error);
          reject("Gagal mengunggah gambar");
        });

        stream.on("finish", () => {
          resolve();
        });

        stream.end(image.buffer);
      });

      imageUrl = `https://storage.googleapis.com/${storageBucket}/${fileName}`;
    }

    // Perbarui data film di MongoDB
    const updatedFilm = await Film.findByIdAndUpdate(
      filmId,
      {
        nama,
        deskripsi,
        tanggal,
        genre,
        ...(imageUrl && { image: imageUrl }), // Hanya perbarui URL gambar jika ada perubahan
      },
      { new: true }
    );

    return updatedFilm;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const deleteFilm = async (filmId) => {
  try {
    await Film.findByIdAndDelete(filmId);
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

module.exports = {
  createFilm,
  getFilms,
  getFilmById,
  updateFilm,
  deleteFilm,
};
