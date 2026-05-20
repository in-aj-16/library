import Link from "next/link";
export default function HomePage() {
return (
<main className="min-h-screen flex items-center justify-center px-6">
<div className="text-center max-w-2xl">
<h1 className="text-6xl md:text-7xl font-bold mb-6">
Ex libris AJ
</h1>
<p className="text-lg md:text-lg opacity-80 mb-10 leading-relaxed">
A personal catalogue of beloved books, marginalia,
borrowed copies, and treasured editions.
</p>
<Link
href="/library"
className="inline-block bg-[#3d2a1d] text-white px-8 py-3 rounded-2xl
text-lg hover:opacity-90 transition"
>
Enter Library
</Link>
</div>
</main>
);
}