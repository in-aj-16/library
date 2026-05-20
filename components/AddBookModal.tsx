"use client";

import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  db,
  updateDoc,
  doc,
} from "@/firebase/config";

export default function AddBookModal({
  refresh,
  editingBook,
  setEditingBook,
}: {
  refresh: () => void;
  editingBook: any;
  setEditingBook: any;
}) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] =
    useState("");

  const [purchaseDate, setPurchaseDate] =
    useState("");

  const [stamped, setStamped] =
    useState(false);

  const [status, setStatus] = useState<
    "At Home" | "Lent"
  >("At Home");

  const [lentTo, setLentTo] =
    useState("");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] =
    useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (!editingBook) return;

    setOpen(true);

    setTitle(editingBook.title || "");
    setAuthor(editingBook.author || "");
    setPublisher(
      editingBook.publisher || ""
    );

    setPurchaseDate(
      editingBook.purchaseDate || ""
    );

    setStamped(
      editingBook.stamped || false
    );

    setStatus(
      editingBook.status || "At Home"
    );

    setLentTo(editingBook.lentTo || "");

    setNotes(editingBook.notes || "");
  }, [editingBook]);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPublisher("");
    setPurchaseDate("");

    setStamped(false);

    setStatus("At Home");

    setLentTo("");

    setNotes("");

    setEditingBook(null);
  };

  const addBook = async () => {
    if (!title || !author) return;

    if (saving) return;

    try {
      setSaving(true);

      const payload = {
  title,
  author,
  publisher,
  purchaseDate,
  stamped,
  status,
  lentTo:
    status === "Lent"
      ? lentTo
      : "",
  notes,
  toSell:
    editingBook?.toSell || false,
};

      // EDIT
      if (editingBook?.id) {
        await updateDoc(
          doc(
            db,
            "books",
            editingBook.id
          ),
          payload
        );
      }

      // ADD
      else {
        await addDoc(
          collection(db, "books"),
          {
            ...payload,
            createdAt: Date.now(),
          }
        );
      }

      resetForm();

      setOpen(false);

      await refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        className="
          bg-[#5c3b28]
          hover:bg-[#4a2f20]
          text-white
          px-4 py-2
          rounded-2xl
          transition-all
          duration-200
          shadow-md
          hover:shadow-lg
        "
      >
        Add Book
      </button>

      {open && (
        <div
          className="
            fixed inset-0
            bg-black/50
            backdrop-blur-sm
            flex items-center justify-center
            p-3
            z-50
          "
        >
          <div
            className="
              bg-[#fffdf9]
              w-full
              max-w-2xl
              rounded-[32px]
              p-3 md:p-8
              overflow-y-auto
              max-h-[90vh]
              shadow-2xl
              border border-[#e5d8c7]
            "
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingBook
                ? "Edit Book"
                : "Add Book"}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <input
                placeholder="Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="
                  w-full
                  px-3 py-2
                  rounded-2xl
                  border border-[#d7ccbf]
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-[#8b5e3c]
                  transition
                "
              />

              {/* Author */}
              <input
                placeholder="Author"
                value={author}
                onChange={(e) =>
                  setAuthor(e.target.value)
                }
                className="
                  w-full
                  px-3 py-2
                  rounded-2xl
                  border border-[#d7ccbf]
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-[#8b5e3c]
                  transition
                "
              />

              {/* Publisher */}
              <input
                placeholder="Publisher"
                value={publisher}
                onChange={(e) =>
                  setPublisher(
                    e.target.value
                  )
                }
                className="
                  w-full
                  px-3 py-2
                  rounded-2xl
                  border border-[#d7ccbf]
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-[#8b5e3c]
                  transition
                "
              />

              {/* Purchase Date */}
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) =>
                  setPurchaseDate(
                    e.target.value
                  )
                }
                className="
                  w-full
                  px-3 py-2
                  rounded-2xl
                  border border-[#d7ccbf]
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-[#8b5e3c]
                  transition
                "
              />

              {/* Stamped */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Stamped
                </label>

                <select
                  value={
                    stamped
                      ? "Yes"
                      : "No"
                  }
                  onChange={(e) =>
                    setStamped(
                      e.target.value ===
                        "Yes"
                    )
                  }
                  className="
                    w-full
                    px-3 py-2
                    rounded-2xl
                    border border-[#d7ccbf]
                    bg-white
                  "
                >
                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target
                        .value as
                        | "At Home"
                        | "Lent"
                    )
                  }
                  className="
                    w-full
                    px-3 py-2
                    rounded-2xl
                    border border-[#d7ccbf]
                    bg-white
                  "
                >
                  <option value="At Home">
                    At Home
                  </option>

                  <option value="Lent">
                    Lent
                  </option>
                </select>
              </div>

              {/* Lent To */}
              {status === "Lent" && (
                <input
                  placeholder="Lent to"
                  value={lentTo}
                  onChange={(e) =>
                    setLentTo(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    px-3 py-2
                    rounded-2xl
                    border border-[#d7ccbf]
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-[#8b5e3c]
                    transition
                  "
                />
              )}

              {/* Notes */}
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                className="
                  w-full
                  px-3 py-2
                  rounded-2xl
                  border border-[#d7ccbf]
                  bg-white
                  min-h-[150px]
                  outline-none
                  focus:ring-2
                  focus:ring-[#8b5e3c]
                  transition
                "
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-8">
              <button
                onClick={addBook}
                disabled={saving}
                className="
                  bg-[#5c3b28]
                  hover:bg-[#4a2f20]
                  disabled:opacity-50
                  text-white
                  px-4 py-2
                  rounded-2xl
                  transition-all
                  duration-200
                  shadow-md
                "
              >
                {saving
                  ? "Saving..."
                  : editingBook
                  ? "Save Changes"
                  : "Save Book"}
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="
                  border
                  border-[#d7ccbf]
                  px-4 py-2
                  rounded-2xl
                  hover:bg-[#f4ede3]
                  transition
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}