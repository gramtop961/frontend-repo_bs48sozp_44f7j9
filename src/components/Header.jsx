import { Search } from "lucide-react";
import { useState } from "react";

export default function Header({ onSearch }) {
  const [term, setTerm] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch(term.trim());
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory Tracker</h1>
        <p className="text-sm text-muted-foreground">Track products, stock levels, and low-stock alerts.</p>
      </div>
      <form onSubmit={submit} className="w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by name or SKU"
            className="w-full sm:w-80 rounded-md border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </form>
    </div>
  );
}
