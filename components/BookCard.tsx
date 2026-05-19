import { Book } from "@/types/book";

type Props = {
  book: Book;

  onDelete: (id: string) => void;

  onEdit: (book: Book) => void;

  onToggleStamped: (
    book: Book
  ) => void;

  onToggleStatus: (
    book: Book
  ) => void;
};

export default function BookCard({
  book,
  onDelete,
  onEdit,
  onToggleStamped,
  onToggleStatus,
}: Props) {
  return (
    <div
      className="
        bg-[#fffdf9]
        rounded-[28px]
        p-6
        shadow-sm
        border border-[#e4d8ca]
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      {/* Top */}
      <div
  className="
    flex
    flex-col
    sm:flex-row
    sm:justify-between
    gap-4
  "
>
        <div>
          <h2 className="text-3xl font-bold">
            {book.title}
          </h2>

          <p className="mt-3 text-xl opacity-80">
            {book.author}
          </p>

          <p className="opacity-60 mt-1">
            {book.publisher}
          </p>
        </div>

        {/* Buttons */}
        <div
  className="
    flex gap-2
    h-fit
    flex-wrap
  "
>
          <button
            onClick={() => onEdit(book)}
            className="
              text-sm
              px-3 py-1
              rounded-xl
              bg-[#ede3d6]
              hover:bg-[#e1d2c0]
              transition
            "
          >
            Edit
          </button>

          <button
            onClick={() =>
              onDelete(book.id!)
            }
            className="
              text-sm
              px-3 py-1
              rounded-xl
              bg-red-100
              text-red-700
              hover:bg-red-200
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-5 flex flex-wrap gap-2">
        {/* Stamped */}
        <button
          onClick={() =>
            onToggleStamped(book)
          }
          className={`
            px-3 py-1
            rounded-full
            text-sm
            transition
            hover:scale-105
            ${
              book.stamped
                ? "bg-amber-100 text-amber-900"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          {book.stamped
            ? "STAMPED"
            : "NOT STAMPED"}
        </button>

        {/* Status */}
        <button
          onClick={() =>
            onToggleStatus(book)
          }
          className={`
            px-3 py-1
            rounded-full
            text-sm
            transition
            hover:scale-105
            ${
              book.status === "Lent"
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
            }
          `}
        >
          {book.status === "Lent"
            ? `Lent to ${book.lentTo}`
            : "At Home"}
        </button>
      </div>

      {/* Purchase Date */}
      {book.purchaseDate && (
        <p className="mt-5 text-sm opacity-60">
          Purchased on{" "}
          {book.purchaseDate}
        </p>
      )}

      {/* Notes */}
      {book.notes && (
        <div
          className="
            mt-5
            bg-[#f4efe8]
            rounded-2xl
            p-4
          "
        >
          <p className="leading-relaxed">
            {book.notes}
          </p>
        </div>
      )}
    </div>
  );
}