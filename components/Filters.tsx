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
      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
        className="
          h-[44px]
          px-3
          rounded-xl
          border
          border-[#cdbda8]
          bg-white
          text-[10px]
          outline-none
        "
      >
        <option value="all">
          All Books
        </option>

        <option value="stamped">
          Stamped
        </option>

        <option value="lent">
          Lent
        </option>

        <option value="available">
          Available
        </option>
      </select>

      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
        className="
          h-[44px]
          px-3
          rounded-xl
          border
          border-[#cdbda8]
          bg-white
          text-[10px]
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
      </select>
    </div>
  );
}