type Props = {
  filter: string;

  setFilter: (
    value: string
  ) => void;

  sort: string;

  setSort: (
    value: string
  ) => void;
};

export default function Filters({
  filter,
  setFilter,
  sort,
  setSort,
}: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {/* Filter */}
      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
        className="
          h-[44px]
          px-4
          rounded-xl
          border
          border-[#cdbda8]
          bg-white
          text-sm
          outline-none
        "
      >
        <option value="all">
          All Books
        </option>

        <option value="stamped">
          Stamped
        </option>

        <option value="notStamped">
          Not Stamped
        </option>

        <option value="lent">
          Lent
        </option>

        <option value="available">
          Available
        </option>

        <option value="tbr">
          TBR
        </option>

        <option value="reading">
          Reading
        </option>

        <option value="read">
          Read
        </option>

        <option value="paused">
          Paused
        </option>

        <option value="dnf">
          DNF
        </option>
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
        className="
          h-[44px]
          px-4
          rounded-xl
          border
          border-[#cdbda8]
          bg-white
          text-sm
          outline-none
        "
      >
        <option value="createdAt">
          Added Order
        </option>

        <option value="title">
          Title
        </option>

        <option value="author">
          Author
        </option>

        <option value="publisher">
          Publisher
        </option>

        <option value="readingStatus">
          Reading Status
        </option>
      </select>
    </div>
  );
}