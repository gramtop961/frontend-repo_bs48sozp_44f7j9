import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import StatsBar from "./components/StatsBar.jsx";
import ItemForm from "./components/ItemForm.jsx";
import InventoryTable from "./components/InventoryTable.jsx";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total_skus: 0, total_units: 0, low_stock: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => items, [items]);

  const api = async (path, options = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      let msg = 'Request failed';
      try { const j = await res.json(); msg = j.detail || JSON.stringify(j); } catch {}
      throw new Error(msg);
    }
    if (res.status === 204) return null;
    return res.json();
  };

  const fetchAll = async (q = "") => {
    const query = q ? `?q=${encodeURIComponent(q)}` : "";
    const [list, s] = await Promise.all([
      api(`/items${query}`),
      api("/items/stats"),
    ]);
    setItems(list);
    setStats(s);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = async (term) => {
    setSearch(term);
    await fetchAll(term);
  };

  const createItem = async (data) => {
    setLoading(true);
    try {
      const created = await api('/items', { method: 'POST', body: JSON.stringify(data) });
      setItems((prev) => [created, ...prev]);
      const s = await api('/items/stats');
      setStats(s);
    } finally {
      setLoading(false);
    }
  };

  const adjust = async (id, delta) => {
    const updated = await api(`/items/${id}/adjust`, { method: 'POST', body: JSON.stringify({ delta }) });
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
    const s = await api('/items/stats');
    setStats(s);
  };

  const remove = async (id) => {
    await api(`/items/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((it) => it.id !== id));
    const s = await api('/items/stats');
    setStats(s);
  };

  const update = async (id, fields) => {
    const updated = await api(`/items/${id}`, { method: 'PUT', body: JSON.stringify(fields) });
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <Header onSearch={handleSearch} />
        <StatsBar stats={stats} />
        <div className="rounded-lg border p-4">
          <div className="mb-3 text-sm font-medium">Add New Item</div>
          <ItemForm onCreate={createItem} loading={loading} />
        </div>
        <InventoryTable items={filteredItems} onAdjust={adjust} onDelete={remove} onUpdate={update} />
        <footer className="pt-8 text-center text-xs text-muted-foreground">Backend URL: {BASE_URL || 'not set'} • {items.length} items</footer>
      </div>
    </div>
  );
}
