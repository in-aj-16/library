"use client";

import { useEffect, useMemo, useState } from "react";

import {
  db,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "@/firebase/config";

import { Book } from "@/types/book";

import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import BookCard from "@/components/BookCard";
import AddBookModal from "@/components/AddBookModal";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("createdAt");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  const [view, setView] = useState<
    "grid" | "list"
  >("grid");

  const [editingBook, setEditingBook] =
    useState<Book | null>(null);

  const [toast, setToast] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activePage, setActivePage] =
    useState<
      "library" | "lent" | "sell"
    >("library");

  const showToast = (
    message: string
  ) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const fetchBooks = async () => {
    const snapshot = await getDocs(
      collection(db, "books")
    );

    const data = snapshot.docs.map(
      (docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Book),
      })
    );

    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const deleteBook = async (
    id: string
  ) => {
    const confirmed = confirm(
      "Delete this book?"
    );

    if (!confirmed) return;

    await deleteDoc(
      doc(db, "books", id)
    );

    fetchBooks();

    showToast("Book deleted");
  };

  const toggleStamped = async (
    book: Book
  ) => {
    await updateDoc(
      doc(db, "books", book.id!),
      {
        stamped: !book.stamped,
      }
    );

    fetchBooks();
  };

  const toggleStatus = async (
    book: Book
  ) => {
    if (book.status === "At Home") {
      const name = prompt(
        "Lent to whom?"
      );

      if (!name) return;

      await updateDoc(
        doc(db, "books", book.id!),
        {
          status: "Lent",
          lentTo: name,
        }
      );
    } else {
      await updateDoc(
        doc(db, "books", book.id!),
        {
          status: "At Home",
          lentTo: "",
        }
      );
    }

    fetchBooks();
  };

  const toggleSell = async (
    book: Book
  ) => {
    await updateDoc(
      doc(db, "books", book.id!),
      {
        toSell: !book.toSell,
      }
    );

    fetchBooks();
  };

  const exportCSV = () => {
    const headers = [
      "Title",
      "Author",
      "Publisher",
      "Purchase Date",
      "Stamped",
      "Status",
      "Reading Status",
      "Lent To",
      "To Sell",
      "Notes",
    ];

    const rows = books.map(
      (book) => [
        book.title,
        book.author,
        book.publisher,
        book.purchaseDate || "",
        book.stamped
          ? "Yes"
          : "No",
        book.status,
        book.readingStatus ||
          "TBR",
        book.lentTo || "",
        book.toSell
          ? "Yes"
          : "No",
        book.notes || "",
      ]
    );

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (value) => `"${value}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "ex-libris-aj-library.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    showToast("CSV exported");
  };

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (activePage === "lent") {
      result = result.filter(
        (b) => b.status === "Lent"
      );
    }

    if (activePage === "sell") {
      result = result.filter(
        (b) => b.toSell
      );
    }

    if (filter === "stamped") {
      result = result.filter(
        (b) => b.stamped
      );
    }

    if (filter === "lent") {
      result = result.filter(
        (b) => b.status === "Lent"
      );
    }

    if (filter === "available") {
      result = result.filter(
        (b) => b.status === "At Home"
      );
    }

    if (filter === "tbr") {
      result = result.filter(
        (b) =>
          b.readingStatus === "TBR"
      );
    }

    if (filter === "reading") {
      result = result.filter(
        (b) =>
          b.readingStatus ===
          "Reading"
      );
    }

    if (filter === "read") {
      result = result.filter(
        (b) =>
          b.readingStatus ===
          "Read"
      );
    }

    if (filter === "paused") {
      result = result.filter(
        (b) =>
          b.readingStatus ===
          "Paused"
      );
    }

    if (filter === "dnf") {
      result = result.filter(
        (b) =>
          b.readingStatus === "DNF"
      );
    }

    if (search.trim()) {
      const term =
        search.toLowerCase();

      result = result.filter(
        (book) => {
          return (
            book.title
              .toLowerCase()
              .includes(term) ||
            book.author
              .toLowerCase()
              .includes(term) ||
            book.publisher
              .toLowerCase()
              .includes(term) ||
            book.notes
              ?.toLowerCase()
              .includes(term) ||
            book.lentTo
              ?.toLowerCase()
              .includes(term)
          );
        }
      );
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sort === "createdAt") {
        comparison =
          a.createdAt -
          b.createdAt;
      } else {
        comparison = String(
          a[sort as keyof Book]
        ).localeCompare(
          String(
            b[sort as keyof Book]
          )
        );
      }

      return sortDirection ===
        "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    books,
    search,
    filter,
    sort,
    sortDirection,
    activePage,
  ]);

  return (
    <main className="min-h-screen bg-[#f6f1e9] text-[#2d1f14]">
      {toast && (
        <div
          className="
            fixed
            top-4
            right-4
            z-50
            bg-[#2d1f14]
            text-white
            px-3 py-2
            rounded-xl
            text-sm
          "
        >
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed
          top-0
          left-0
          h-full
          w-[220px]
          z-50
          transition-transform
          duration-300
          p-5
          border-r
          bg-[#fffaf2]
          border-[#e8dccd]
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">
            Ex libris AJ
          </h2>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="text-xl opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              setActivePage(
                "library"
              );
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl transition text-[15px] ${
              activePage === "library"
                ? "bg-[#5c3b28] text-white"
                : "hover:bg-[#efe5d7]"
            }`}
          >
            Library
          </button>

          <button
            onClick={() => {
              setActivePage("lent");
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl transition text-[15px] ${
              activePage === "lent"
                ? "bg-[#5c3b28] text-white"
                : "hover:bg-[#efe5d7]"
            }`}
          >
            Lent Books
          </button>

          <button
            onClick={() => {
              setActivePage("sell");
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-xl transition text-[15px] ${
              activePage === "sell"
                ? "bg-[#5c3b28] text-white"
                : "hover:bg-[#efe5d7]"
            }`}
          >
            Selling Stack
          </button>

          <button
            onClick={exportCSV}
            className="w-full text-left px-3 py-2 rounded-xl transition text-[15px] hover:bg-[#efe5d7]"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="text-xl w-9 h-9 rounded-xl hover:bg-[#eadfce] transition"
        >
          ☰
        </button>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold leading-none">
              Ex libris AJ
            </h1>

            <div className="inline-flex items-center gap-2 px-3 h-[36px] rounded-xl bg-[#efe5d7] text-[#5c3b28]">
              <span className="text-sm font-medium">
                {activePage ===
                "lent"
                  ? "Lent Books"
                  : activePage ===
                    "sell"
                  ? "Selling Stack"
                  : "Library"}
              </span>

              <span className="text-xs opacity-60">
                •
              </span>

              <span className="text-xs opacity-60">
                {filteredBooks.length}
              </span>
            </div>
          </div>

          <p className="opacity-60 text-sm mt-1">
            {books.length} books
            catalogued
          </p>
        </div>

        <div className="ml-auto">
          <AddBookModal
            refresh={fetchBooks}
            editingBook={
              editingBook
            }
            setEditingBook={
              setEditingBook
            }
          />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 pb-10">
        <div className="space-y-4 mb-6">
          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <div className="flex flex-wrap gap-2 items-center">
            <Filters
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
            />

            <button
              onClick={() =>
                setSortDirection(
                  (prev) =>
                    prev === "asc"
                      ? "desc"
                      : "asc"
                )
              }
              className="h-[44px] px-4 rounded-xl bg-white border border-[#cdbda8] text-sm"
            >
              {sortDirection ===
              "asc"
                ? "Ascending ↑"
                : "Descending ↓"}
            </button>

            <div className="flex rounded-xl overflow-hidden border border-[#d7ccbf]">
              <button
                onClick={() =>
                  setView("grid")
                }
                className={`h-[44px] px-4 text-sm transition ${
                  view === "grid"
                    ? "bg-[#5c3b28] text-white"
                    : "bg-white"
                }`}
              >
                Grid
              </button>

              <button
                onClick={() =>
                  setView("list")
                }
                className={`h-[44px] px-4 text-sm transition ${
                  view === "list"
                    ? "bg-[#5c3b28] text-white"
                    : "bg-white"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {filteredBooks.length ===
        0 ? (
          <div className="text-center py-20 opacity-50">
            No books found
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map(
              (book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  activePage={
                    activePage
                  }
                  onDelete={
                    deleteBook
                  }
                  onEdit={
                    setEditingBook
                  }
                  onToggleStamped={
                    toggleStamped
                  }
                  onToggleStatus={
                    toggleStatus
                  }
                  onToggleSell={
                    toggleSell
                  }
                />
              )
            )}
          </div>
        ) : (
          <div
  className="
    overflow-x-auto
    rounded-2xl
    border
    bg-[#fffdf9]
    border-[#e4d8ca]
  "
>
  <table className="w-full">
    <thead>
      <tr className="bg-[#f4ede3]">
        <th className="text-left p-3 text-sm">
          Title
        </th>

        <th className="text-left p-3 text-sm">
          Author
        </th>

        <th className="text-left p-3 text-sm">
          Reading
        </th>

        <th className="text-left p-3 text-sm">
          Stamped
        </th>

        <th className="text-left p-3 text-sm">
          Status
        </th>

        <th className="text-left p-3 text-sm">
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
      {filteredBooks.map(
        (book) => (
          <tr
            key={book.id}
            className={`
              border-b
              border-[#f1e7da]

              ${
                book.toSell
                  ? "bg-[#fde2e2]"
                  : ""
              }
            `}
          >
            {/* Title */}
            <td className="p-3 text-sm font-medium">
              {book.title}
            </td>

            {/* Author */}
            <td className="p-3 text-sm">
              {book.author}
            </td>

            {/* Reading */}
            <td className="p-3 text-sm">
              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-[12px]

                  ${
                    book.readingStatus ===
                    "Read"
                      ? "bg-blue-100 text-blue-700"
                      : book.readingStatus ===
                        "Reading"
                      ? "bg-green-100 text-green-700"
                      : book.readingStatus ===
                        "Paused"
                      ? "bg-yellow-100 text-yellow-700"
                      : book.readingStatus ===
                        "DNF"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-700"
                  }
                `}
              >
                {book.readingStatus ||
                  "TBR"}
              </span>
            </td>

            {/* Stamped */}
            <td className="p-3 text-sm">
              <button
                onClick={() =>
                  toggleStamped(
                    book
                  )
                }
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-[12px]

                  ${
                    book.stamped
                      ? "bg-amber-100 text-amber-900"
                      : "bg-gray-200 text-gray-700"
                  }
                `}
              >
                {book.stamped
                  ? "Stamped"
                  : "Not stamped"}
              </button>
            </td>

            {/* Status */}
            <td className="p-3 text-sm">
              <button
                onClick={() =>
                  toggleStatus(
                    book
                  )
                }
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-[12px]

                  ${
                    book.status ===
                    "Lent"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }
                `}
              >
                {book.status ===
                "Lent"
                  ? `Lent to ${book.lentTo}`
                  : "At Home"}
              </button>
            </td>

            {/* Actions */}
            <td className="p-3 text-sm">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setEditingBook(
                      book
                    )
                  }
                  className="
                    px-3
                    py-1
                    rounded-lg
                    bg-[#efe5d7]
                    text-[12px]
                  "
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteBook(
                      book.id!
                    )
                  }
                  className="
                    px-3
                    py-1
                    rounded-lg
                    bg-red-200
                    text-red-700
                    text-[12px]
                  "
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>
        )}
      </div>
    </main>
  );
}