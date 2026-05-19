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

  const showToast = (
    message: string
  ) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
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

    showToast(
      "Updated stamped status"
    );
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

    showToast(
      "Updated lending status"
    );
  };

  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filters
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

    // Search
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

    // Sorting
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
  ]);

  const lentBooks = books.filter(
    (b) => b.status === "Lent"
  );

  return (
    <main
      className="
        min-h-screen
        max-w-7xl
        mx-auto
        px-4 md:px-8
        py-8 md:py-12
      "
    >
      {/* Toast */}
      {toast && (
        <div
          className="
            fixed
            top-6
            right-6
            z-50
            bg-[#2d1f14]
            text-white
            px-5 py-3
            rounded-2xl
            shadow-xl
          "
        >
          {toast}
        </div>
      )}

      {/* Header */}
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-6
          mb-10
        "
      >
        <div>
          <h1
            className="
              text-5xl md:text-6xl
              font-bold
              tracking-tight
            "
          >
            Ex libris AJ
          </h1>

          <p className="mt-2 opacity-70 text-lg">
            {books.length} books
            catalogued
          </p>
        </div>

        <AddBookModal
          refresh={fetchBooks}
          editingBook={editingBook}
          setEditingBook={
            setEditingBook
          }
        />
      </div>

      {/* Lent Books */}
      {lentBooks.length > 0 && (
        <div
          className="
            bg-[#efe6d8]
            border border-[#dcc8aa]
            rounded-[28px]
            p-6
            mb-10
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            Currently Lent
          </h2>

          <div className="space-y-2">
            {lentBooks.map((book) => (
              <p key={book.id}>
                <strong>
                  {book.title}
                </strong>
                {" → "}
                {book.lentTo}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="space-y-6 mb-10">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <div className="flex flex-wrap gap-4 items-center">
          <Filters
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
          />

          {/* Sort Direction */}
          <button
            onClick={() =>
              setSortDirection(
                (prev) =>
                  prev === "asc"
                    ? "desc"
                    : "asc"
              )
            }
            className="
              px-4 py-3
              rounded-2xl
              border border-[#d7ccbf]
              bg-white
              hover:bg-[#f4ede3]
              transition
            "
          >
            {sortDirection === "asc"
              ? "Ascending ↑"
              : "Descending ↓"}
          </button>

          {/* View Toggle */}
          <div
            className="
              flex
              rounded-2xl
              overflow-hidden
              border border-[#d7ccbf]
            "
          >
            <button
              onClick={() =>
                setView("grid")
              }
              className={`
                px-4 py-3
                transition
                ${
                  view === "grid"
                    ? "bg-[#5c3b28] text-white"
                    : "bg-white"
                }
              `}
            >
              Grid
            </button>

            <button
              onClick={() =>
                setView("list")
              }
              className={`
                px-4 py-3
                transition
                ${
                  view === "list"
                    ? "bg-[#5c3b28] text-white"
                    : "bg-white"
                }
              `}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Books */}
      {filteredBooks.length === 0 ? (
        <div
          className="
            text-center
            py-24
            opacity-70
          "
        >
          <h2 className="text-3xl font-bold">
            No books found
          </h2>

          <p className="mt-3 text-lg">
            Start building your
            library.
          </p>
        </div>
      ) : view === "grid" ? (
        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredBooks.map(
            (book) => (
              <BookCard
                key={book.id}
                book={book}
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
              />
            )
          )}
        </div>
      ) : (
        <div
          className="
            overflow-x-auto
            rounded-[28px]
            border border-[#e4d8ca]
            bg-[#fffdf9]
          "
        >
          <table className="w-full">
            <thead>
              <tr
                className="
                  border-b
                  border-[#e4d8ca]
                  bg-[#f4ede3]
                "
              >
                <th className="text-left p-4">
                  Title
                </th>

                <th className="text-left p-4">
                  Author
                </th>

                <th className="text-left p-4">
                  Publisher
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Stamped
                </th>

                <th className="text-left p-4">
                  Purchase Date
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.map(
                (book) => (
                  <tr
                    key={book.id}
                    className="
                      border-b
                      border-[#f1e7da]
                      hover:bg-[#faf6f0]
                      transition
                    "
                  >
                    <td className="p-4 font-semibold">
                      {book.title}
                    </td>

                    <td className="p-4">
                      {book.author}
                    </td>

                    <td className="p-4">
                      {book.publisher}
                    </td>

                    <td className="p-4">
                      {book.status ===
                      "Lent"
                        ? `Lent to ${book.lentTo}`
                        : "At Home"}
                    </td>

                    <td className="p-4">
                      {book.stamped
                        ? "Stamped"
                        : "Not stamped"}
                    </td>

                    <td className="p-4">
                      {book.purchaseDate ||
                        "-"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}