import React from "react";

function BookList({
  books,
  totalBooks,
  loading,
  searchValue,
  onSearchChange,
  onEdit,
  onDelete
}) {
  function formatDate(date) {
    if (!date) return "-";

    return new Date(`${String(date).slice(0, 10)}T00:00:00`)
      .toLocaleDateString("id-ID");
  }

  return (
    <section className="list-card">
      <div className="list-heading">
        <div>
          <p className="section-kicker">INVENTARIS</p>
          <h2>Daftar Buku</h2>
          <p className="list-count">Total buku: {totalBooks}</p>
        </div>
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="visually-hidden">Cari buku</span>
          <input
            type="search"
            placeholder="Cari judul, penulis, penerbit..."
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      {loading ? (
        <div className="empty-state">Memuat daftar buku...</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          {searchValue ? "Buku yang dicari tidak ditemukan." : "Belum ada data buku. Tambahkan buku pertama melalui formulir di atas."}
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th className="number-column">No.</th>
                <th>Judul Buku</th>
                <th>Penulis</th>
                <th>Tanggal Terbit</th>
                <th>Penerbit</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book, index) => (
                <tr key={book.id}>
                  <td className="number-column">{index + 1}</td>
                  <td className="book-title-cell">{book.title}</td>
                  <td>{book.author}</td>
                  <td>{formatDate(book.publish_date)}</td>
                  <td>{book.publisher}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => onEdit(book)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => onDelete(book.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default BookList;