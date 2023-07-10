const express = require("express");
const mongoose = require("mongoose");
const filmRoutes = require("./routes/filmRoutes");

const app = express();
const port = 3000;

app.use(express.json());

// Koneksi ke MongoDB
mongoose
  .connect(
    "mongodb+srv://rrizalkaa:anjaykelas@cloudhandler.d2j8jow.mongodb.net/cloudhandler?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected!"));

// Gunakan rute filmRoutes
app.use(filmRoutes);

// Jalankan server Express.js
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
