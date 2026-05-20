import { Book } from "@/types/book";

type Props = {
  book: Book;

  activePage:
    | "library"
    | "lent"
    | "sell";

  onDelete: (id: string) => void;

  onEdit: (book: Book) => void;

  onToggleStamped: (
    book: Book
  ) => void;

  onToggleStatus: (
    book: Book
  ) => void;

  onToggleSell: (
    book: Book
  ) => void;
};

export default function BookCard({
  book,
  activePage,
  onDelete,
  onEdit,
  onToggleStamped,
  onToggleStatus,
  onToggleSell,
}: Props) {
  return (
    <div
      className={`
        rounded-[24px]
        p-5
        shadow-sm
        border
        transition-all
        duration-300

        ${
          book.toSell
            ? "bg-[#fde2e2] border-[#f2caca]"
            : "bg-[#fffdf9] border-[#e4d8ca]"
        }
      `}
    >
      {/* Top */}
      <div className="flex justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-tight">
            {book.title}
          </h2>

          <p className="mt-2 text-lg opacity-80">
            {book.author}
          </p>

          <p className="opacity-60 text-sm mt-1">
            {book.publisher}
          </p>
        </div>

        <div className="flex flex-col gap-2 h-fit">
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
              bg-red-200
              text-red-700
              hover:bg-red-200
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() =>
            onToggleStamped(book)
          }
          className={`
            px-3
            py-1
            rounded-full
            text-[12px]
            transition

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

        <button
          onClick={() =>
            onToggleStatus(book)
          }
          className={`
            px-3
            py-1
            rounded-full
            text-[12px]
            transition

            ${
              book.status === "Lent"
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700"
            }
          `}
        >
          {book.status === "Lent"
            ? `Lent to ${book.lentTo}`
            : "At Home"}
        </button>
      </div>

      {/* Sell Actions */}
{book.toSell &&
activePage === "sell" ? (
  <div className="mt-5 flex gap-2">
    <button
      onClick={() =>
        onDelete(book.id!)
      }
      className="
        flex-1
        py-2
        rounded-xl
        bg-green-100
        text-green-700
        text-sm
        hover:bg-green-200
        transition
      "
    >
      ✓ Sold
    </button>

    <button
      onClick={() =>
        onToggleSell(book)
      }
      className="
        flex-1
        py-2
        rounded-xl
        bg-red-200
        text-red-700
        text-sm
        hover:bg-red-200
        transition
      "
    >
      ✕ Remove
    </button>
  </div>
) : !book.toSell ? (
  <button
    onClick={() =>
      onToggleSell(book)
    }
    className="
      mt-5
      w-full
      py-2
      rounded-xl
      bg-[#efe5d7]
      text-[#5c3b28]
      text-sm
      hover:bg-[#e7dac8]
      transition
    "
  >
    Mark To Sell
  </button>
) : null}

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
          <p className="text-sm leading-relaxed">
            {book.notes}
          </p>
        </div>
      )}
    </div>
  );
}