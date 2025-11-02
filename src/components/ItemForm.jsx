import { useState } from "react";

export default function ItemForm({ onCreate, loading }) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    location: "",
    quantity: 0,
    min_stock: 0,
    cost: 0,
    price: 0,
  });

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'quantity' || name === 'min_stock' ? Number(value) : name === 'cost' || name === 'price' ? Number(value) : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sku) return;
    await onCreate({ ...form });
    setForm({ name: "", sku: "", category: "", location: "", quantity: 0, min_stock: 0, cost: 0, price: 0 });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
      <Field label="Name">
        <input name="name" value={form.name} onChange={update} required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
      </Field>
      <Field label="SKU">
        <input name="sku" value={form.sku} onChange={update} required className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
      </Field>
      <Field label="Category">
        <input name="category" value={form.category} onChange={update} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
      </Field>
      <Field label="Location">
        <input name="location" value={form.location} onChange={update} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
      </Field>
      <Field label="Qty">
        <input name="quantity" type="number" min={0} value={form.quantity} onChange={update} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
      </Field>
      <div className="flex gap-2">
        <button disabled={loading} className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90 disabled:opacity-50">
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
      <div className="md:col-span-6 grid grid-cols-3 gap-3">
        <Field label="Min Stock">
          <input name="min_stock" type="number" min={0} value={form.min_stock} onChange={update} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </Field>
        <Field label="Cost">
          <input name="cost" type="number" min={0} step="0.01" value={form.cost} onChange={update} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </Field>
        <Field label="Price">
          <input name="price" type="number" min={0} step="0.01" value={form.price} onChange={update} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
        </Field>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
