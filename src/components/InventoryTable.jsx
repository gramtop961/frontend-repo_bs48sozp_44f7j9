import { Trash2, Plus, Minus, Pencil } from "lucide-react";
import { useState } from "react";

export default function InventoryTable({ items, onAdjust, onDelete, onUpdate }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <Th>Name</Th>
            <Th>SKU</Th>
            <Th>Category</Th>
            <Th>Location</Th>
            <Th className="text-right">Qty</Th>
            <Th className="text-right">Min</Th>
            <Th className="text-right">Cost</Th>
            <Th className="text-right">Price</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-6 text-center text-muted-foreground">No items found</td>
            </tr>
          ) : (
            items.map((item) => (
              <Row key={item.id} item={item} onAdjust={onAdjust} onDelete={onDelete} onUpdate={onUpdate} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, onAdjust, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: item.name, category: item.category || "", location: item.location || "", min_stock: item.min_stock || 0, cost: item.cost || 0, price: item.price || 0 });

  const save = async () => {
    await onUpdate(item.id, draft);
    setEditing(false);
  };

  return (
    <tr className="border-t">
      <Td>
        {editing ? (
          <input className="w-full rounded border bg-background px-2 py-1" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
        ) : (
          <span className="font-medium">{item.name}</span>
        )}
      </Td>
      <Td>{item.sku}</Td>
      <Td>
        {editing ? (
          <input className="w-full rounded border bg-background px-2 py-1" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} />
        ) : (
          item.category || "—"
        )}
      </Td>
      <Td>
        {editing ? (
          <input className="w-full rounded border bg-background px-2 py-1" value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} />
        ) : (
          item.location || "—"
        )}
      </Td>
      <Td className="text-right">
        <div className="inline-flex items-center gap-2">
          <button onClick={() => onAdjust(item.id, -1)} className="rounded border p-1 hover:bg-muted" aria-label="decrement"><Minus className="h-4 w-4" /></button>
          <span className={`tabular-nums px-1 ${item.min_stock && item.quantity < item.min_stock ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}`}>{item.quantity}</span>
          <button onClick={() => onAdjust(item.id, +1)} className="rounded border p-1 hover:bg-muted" aria-label="increment"><Plus className="h-4 w-4" /></button>
        </div>
      </Td>
      <Td className="text-right">
        {editing ? (
          <input type="number" min={0} className="w-20 rounded border bg-background px-2 py-1 text-right" value={draft.min_stock} onChange={(e) => setDraft((d) => ({ ...d, min_stock: Number(e.target.value) }))} />
        ) : (
          <span className="tabular-nums">{item.min_stock ?? 0}</span>
        )}
      </Td>
      <Td className="text-right">
        {editing ? (
          <input type="number" min={0} step="0.01" className="w-24 rounded border bg-background px-2 py-1 text-right" value={draft.cost} onChange={(e) => setDraft((d) => ({ ...d, cost: Number(e.target.value) }))} />
        ) : (
          <span className="tabular-nums">${item.cost?.toFixed?.(2) ?? (Number(item.cost || 0)).toFixed(2)}</span>
        )}
      </Td>
      <Td className="text-right">
        {editing ? (
          <input type="number" min={0} step="0.01" className="w-24 rounded border bg-background px-2 py-1 text-right" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))} />
        ) : (
          <span className="tabular-nums">${item.price?.toFixed?.(2) ?? (Number(item.price || 0)).toFixed(2)}</span>
        )}
      </Td>
      <Td className="text-right">
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing((v) => !v)} className="rounded border px-2 py-1 hover:bg-muted inline-flex items-center gap-1"><Pencil className="h-4 w-4" /> {editing ? 'Cancel' : 'Edit'}</button>
          {editing ? (
            <button onClick={save} className="rounded bg-primary px-3 py-1 text-primary-foreground hover:opacity-90">Save</button>
          ) : (
            <button onClick={() => onDelete(item.id)} className="rounded border px-2 py-1 hover:bg-destructive/10 text-destructive inline-flex items-center gap-1"><Trash2 className="h-4 w-4" /> Delete</button>
          )}
        </div>
      </Td>
    </tr>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-3 py-2 text-left text-xs font-medium uppercase ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 align-middle ${className}`}>{children}</td>;
}
