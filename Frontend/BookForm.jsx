import React, { useEffect, useState } from "react";

function BookForm({ bookToEdit, onSubmit, onCancel, saving }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [publisher, setPublisher] = useState("");

  // Mengisi form ketika pengguna memilih tombol edit
  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || "");
      setAuthor(bookToEdit.author || "");
      setPublishDate(
        bookToEdit.publish_date
          ? String(bookToEdit.publish_date).slice(0, 10)
          : ""
      );
      setPublisher(bookToEdit.publisher || "");
    } else {
      setTitle("");
      setAuthor("");
      setPublishDate("");
      setPublisher("");
    }
  }, [bookToEdit]);

  // Mengirim data form ke App.jsx
  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      title,
      author,
      publish_date: publishDate || null,
      publisher
    });
  }

  return (
    <section className="form-card">
      <div className="card-heading">
        <div>
          <p className="section-kicker">{bookToEdit ? "PERBARUI KOLEKSI" : "KOLEKSI BUKU"}</p>
          <h2>{bookToEdit ? "Edit Buku" : "Tambah Buku"}</h2>
        </div>
        <span className="heading-icon" aria-hidden="true">{bookToEdit ? "✎" : "+"}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
        <div className="form-group">
            <label htmlFor="book-title">Judul Buku</label>
            <input
              id="book-title"
              type="text"
              placeholder="Masukkan judul buku"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-author">Penulis</label>
            <input
              id="book-author"
              type="text"
              placeholder="Masukkan nama penulis"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-publish-date">Tanggal Terbit</label>
            <input
              id="book-publish-date"
              type="date"
              value={publishDate}
              onChange={(event) => setPublishDate(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="book-publisher">Penerbit</label>
            <input
              id="book-publisher"
              type="text"
              placeholder="Masukkan nama penerbit"
              value={publisher}
              onChange={(event) => setPublisher(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : bookToEdit ? "Simpan Perubahan" : "Tambah Buku"}
          </button>

          {bookToEdit && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default BookForm;