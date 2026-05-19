type Props = {
search: string;
setSearch: (value: string) => void;
};

export default function SearchBar({
search,
setSearch,
}: Props) {
return (
<input
type="text"
placeholder="Search everything..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="w-full p-4 rounded-2xl border border-[#c9b9a6] bg-white"
/>
);
}