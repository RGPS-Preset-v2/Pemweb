const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi database Supabase
const databaseConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    };

const pool = new Pool({
  ...databaseConfig,
  ssl: process.env.DB_SSL === "false"
    ? false
    : { rejectUnauthorized: false }
});

function isValidPublishDate(value) {
  if (value == null || value === "") return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function parseBookId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// Endpoint utama
app.get("/", (req, res) => {
  res.json({
    message: "Books API is running"
  });
});

// GET: Mengambil seluruh data buku
app.get("/books", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books ORDER BY id ASC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error mengambil data buku:", error);

    res.status(500).json({
      message: "Gagal mengambil data buku"
    });
  }
});

// POST: Menambahkan buku
app.post("/books", async (req, res) => {
  try {
    const {
      title,
      author,
      publish_date,
      publisher
    } = req.body || {};

    if (
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      typeof publisher !== "string" || !publisher.trim()
    ) {
      return res.status(400).json({
        message: "Judul, penulis, dan penerbit wajib diisi"
      });
    }

    if (!isValidPublishDate(publish_date)) {
      return res.status(400).json({
        message: "Tanggal terbit harus menggunakan format YYYY-MM-DD"
      });
    }

    const result = await pool.query(
      `INSERT INTO books
       (title, author, publish_date, publisher)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        title.trim(),
        author.trim(),
        publish_date || null,
        publisher.trim()
      ]
    );

    res.status(201).json({
      message: "Buku berhasil ditambahkan",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error menambahkan buku:", error);

    res.status(500).json({
      message: "Gagal menambahkan buku"
    });
  }
});

// PUT: Mengubah data buku
app.put("/books/:id", async (req, res) => {
  try {
    const id = parseBookId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "ID buku tidak valid" });
    }

    const {
      title,
      author,
      publish_date,
      publisher
    } = req.body || {};

    if (
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      typeof publisher !== "string" || !publisher.trim()
    ) {
      return res.status(400).json({
        message: "Judul, penulis, dan penerbit wajib diisi"
      });
    }

    if (!isValidPublishDate(publish_date)) {
      return res.status(400).json({
        message: "Tanggal terbit harus menggunakan format YYYY-MM-DD"
      });
    }

    const result = await pool.query(
      `UPDATE books
       SET title = $1,
           author = $2,
           publish_date = $3,
           publisher = $4
       WHERE id = $5
       RETURNING *`,
      [
        title.trim(),
        author.trim(),
        publish_date || null,
        publisher.trim(),
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Buku tidak ditemukan"
      });
    }

    res.status(200).json({
      message: "Buku berhasil diperbarui",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error mengubah buku:", error);

    res.status(500).json({
      message: "Gagal mengubah data buku"
    });
  }
});

// DELETE: Menghapus data buku
app.delete("/books/:id", async (req, res) => {
  try {
    const id = parseBookId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "ID buku tidak valid" });
    }

    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Buku tidak ditemukan"
      });
    }

    res.status(200).json({
      message: "Buku berhasil dihapus"
    });
  } catch (error) {
    console.error("Error menghapus buku:", error);

    res.status(500).json({
      message: "Gagal menghapus buku"
    });
  }
});

// Endpoint tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint tidak ditemukan"
  });
});

// Menjalankan server secara lokal
if (require.main === module) {
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

// Export untuk Vercel
module.exports = app;