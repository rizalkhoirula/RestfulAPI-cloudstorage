const movies = require("../models/moviesModels");
const { Storage } = require("@google-cloud/storage");

const storageBucket = "moviesdata"; // Ganti dengan nama bucket penyimpanan Anda di GCP
const gcStorage = new Storage({
  keyFilename: "../credentials/service-account.json", // Ganti dengan lokasi kunci akses JSON Anda
  projectId: "backend-microservices-392205", // Ganti dengan ID proyek GCP Anda
});

const createmovies = async (moviesData) => {
  try {
    const { nama, deskripsi, tanggal, genre, image } = moviesData;

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

    // Simpan data movies ke MongoDB
    const movies = new movies({
      nama,
      deskripsi,
      tanggal,
      genre,
      image: `https://storage.googleapis.com/${storageBucket}/${fileName}`,
    });

    await movies.save();

    return movies;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const getmoviess = async () => {
  try {
    const moviess = await movies.find();
    return moviess;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const getmoviesById = async (moviesId) => {
  try {
    const movies = await movies.findById(moviesId);
    return movies;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const updatemovies = async (moviesId, moviesData) => {
  try {
    const { nama, deskripsi, tanggal, genre, image } = moviesData;

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

    // Perbarui data movies di MongoDB
    const updatedmovies = await movies.findByIdAndUpdate(
      moviesId,
      {
        nama,
        deskripsi,
        tanggal,
        genre,
        ...(imageUrl && { image: imageUrl }), // Hanya perbarui URL gambar jika ada perubahan
      },
      { new: true }
    );

    return updatedmovies;
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

const deletemovies = async (moviesId) => {
  try {
    await movies.findByIdAndDelete(moviesId);
  } catch (error) {
    console.error("Terjadi kesalahan", error);
    throw new Error("Terjadi kesalahan");
  }
};

module.exports = {
  createmovies,
  getmovies,
  getmoviesById,
  updatemovies,
  deletemovies,
};
