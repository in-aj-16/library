type Props = {
filter: string;
setFilter: (value: string) => void;
sort: string;
setSort: (value: string) => void;
};
export default function Filters({
filter,
setFilter,
sort,
setSort,
}: Props) {
return (
<div className="flex flex-wrap gap-4">
<select
value={filter}
onChange={(e) => setFilter(e.target.value)}
className="p-3 rounded-xl border bg-white"
>
<option value="all">All Books</option>
<option value="stamped">Stamped</option>
<option value="lent">Lent Out</option>
<option value="available">Available</option>
</select>
<select
value={sort}
onChange={(e) => setSort(e.target.value)}
className="p-3 rounded-xl border bg-white"
>
<option value="createdAt">Added Order</option>
<option value="title">Title</option>
<option value="author">Author</option>
<option value="publisher">Publisher</option>
<option value="purchaseDate">Purchase Date</option>
</select>
</div>
);
}
