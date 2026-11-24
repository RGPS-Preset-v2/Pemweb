import React, { useCallback, useEffect, useMemo, useState } from "react";
import BookForm from "./BookForm.jsx";
import BookList from "./BookList.jsx";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080")
  .replace(/\/+$/, "");

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
  } catch {
    throw new Error(
      `Tidak dapat terhubung ke API. Pastikan backend berjalan di ${API_URL}.`
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Permintaan tidak dapat diproses.");
  }

  return result;
}

function App() {
  const [books, setBooks] = useState([]);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadBooks = useCallback(async () => {
    setError("");
    try {
      const data = await request("/books");
      setBooks(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");
    if (!query) return books;

    return books.filter((book) =>
      [book.title, book.author, book.publisher]
        .some((value) => value?.toLocaleLowerCase("id-ID").includes(query))
    );
  }, [books, search]);

  async function handleSubmit(bookData) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const isEditing = Boolean(bookToEdit);
      await request(isEditing ? `/books/${bookToEdit.id}` : "/books", {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(bookData)
      });
      setBookToEdit(null);
      setNotice(isEditing ? "Data buku berhasil diperbarui." : "Buku berhasil ditambahkan.");
      await loadBooks();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;

    setError("");
    setNotice("");
    try {
      await request(`/books/${id}`, { method: "DELETE" });
      setNotice("Buku berhasil dihapus.");
      await loadBooks();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function handleEdit(book) {
    setNotice("");
    setError("");
    setBookToEdit(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setBookToEdit(null);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="RuangBaca, beranda">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span>RuangBaca</span>
        </a>
        <span className="topbar-caption">Sistem informasi perpustakaan</span>
      </header>

      <main className="page-content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">PERPUSTAKAAN</p>
            <h1>Manajemen Stok Buku</h1>
            <p className="page-description">
              Kelola koleksi buku perpustakaan dengan mudah.
            </p>
          </div>
          <div className="total-badge">
            <span className="total-number">{books.length}</span>
            <span className="total-label">Total buku</span>
          </div>
        </section>

        {error && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
            {!books.length && (
              <button type="button" className="text-button" onClick={loadBooks}>
                Coba lagi
              </button>
            )}
          </div>
        )}
        {notice && <div className="alert alert-success" role="status">{notice}</div>}

        <BookForm
          bookToEdit={bookToEdit}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          saving={saving}
        />

        <BookList
          books={visibleBooks}
          totalBooks={books.length}
          loading={loading}
          searchValue={search}
          onSearchChange={setSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <footer className="page-footer">Manajemen Stok Buku</footer>
      </main>
    </div>
  );
}

export default App;
