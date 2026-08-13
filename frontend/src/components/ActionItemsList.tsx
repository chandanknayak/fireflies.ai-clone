"use client";

import { useState } from "react";
import { Plus, Check, Trash2, Circle, Pencil } from "lucide-react";
import type { ActionItem } from "@/types";
import { api, cn } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface ActionItemsListProps {
  items: ActionItem[];
  meetingId: number;
  onUpdate: () => void;
}

export default function ActionItemsList({ items, meetingId, onUpdate }: ActionItemsListProps) {
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAssignee, setEditAssignee] = useState("");

  const handleToggle = async (item: ActionItem) => {
    try {
      await api.updateActionItem(item.id, { completed: !item.completed });
      onUpdate();
    } catch {
      showToast("Failed to update action item", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteActionItem(id);
      showToast("Action item deleted");
      onUpdate();
    } catch {
      showToast("Failed to delete action item", "error");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.createActionItem(meetingId, {
        title: newTitle.trim(),
        assignee: newAssignee.trim() || undefined,
      });
      setNewTitle("");
      setNewAssignee("");
      setAdding(false);
      showToast("Action item added");
      onUpdate();
    } catch {
      showToast("Failed to add action item", "error");
    }
  };

  const startEdit = (item: ActionItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditAssignee(item.assignee || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditAssignee("");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      await api.updateActionItem(id, {
        title: editTitle.trim(),
        assignee: editAssignee.trim() || undefined,
      });
      cancelEdit();
      showToast("Action item updated");
      onUpdate();
    } catch {
      showToast("Failed to update action item", "error");
    }
  };

  const pending = items.filter((i) => !i.completed);
  const completed = items.filter((i) => i.completed);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-fireflies-gray-900">Action Items</h3>
        <button onClick={() => setAdding(true)} className="btn-ghost text-fireflies-purple !py-1 !px-2 text-sm">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="mb-3 p-3 bg-fireflies-gray-50 rounded-lg space-y-2">
          <input
            className="input-field"
            placeholder="Action item title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <input
            className="input-field"
            placeholder="Assignee (optional)"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm !py-1.5">
              Add
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm !py-1.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-1">
        {pending.map((item) => (
          <ActionItemRow
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            editTitle={editTitle}
            editAssignee={editAssignee}
            onEditTitle={setEditTitle}
            onEditAssignee={setEditAssignee}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onSaveEdit={handleSaveEdit}
          />
        ))}
        {completed.length > 0 && (
          <>
            <p className="text-xs text-fireflies-gray-400 font-medium mt-4 mb-2 uppercase tracking-wide">Completed</p>
            {completed.map((item) => (
              <ActionItemRow
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                editTitle={editTitle}
                editAssignee={editAssignee}
                onEditTitle={setEditTitle}
                onEditAssignee={setEditAssignee}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={handleSaveEdit}
              />
            ))}
          </>
        )}
        {items.length === 0 && !adding && (
          <p className="text-sm text-fireflies-gray-400 py-4 text-center">No action items yet</p>
        )}
      </div>
    </div>
  );
}

function ActionItemRow({
  item,
  isEditing,
  editTitle,
  editAssignee,
  onEditTitle,
  onEditAssignee,
  onToggle,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: {
  item: ActionItem;
  isEditing: boolean;
  editTitle: string;
  editAssignee: string;
  onEditTitle: (v: string) => void;
  onEditAssignee: (v: string) => void;
  onToggle: (item: ActionItem) => void;
  onDelete: (id: number) => void;
  onStartEdit: (item: ActionItem) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
}) {
  if (isEditing) {
    return (
      <div className="p-3 bg-fireflies-gray-50 rounded-lg space-y-2">
        <input
          className="input-field"
          value={editTitle}
          onChange={(e) => onEditTitle(e.target.value)}
          autoFocus
        />
        <input
          className="input-field"
          placeholder="Assignee (optional)"
          value={editAssignee}
          onChange={(e) => onEditAssignee(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={() => onSaveEdit(item.id)} className="btn-primary text-sm !py-1.5">
            Save
          </button>
          <button onClick={onCancelEdit} className="btn-secondary text-sm !py-1.5">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 group py-1.5 px-1 rounded-lg hover:bg-fireflies-gray-50">
      <button
        onClick={() => onToggle(item)}
        className={cn(
          "mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
          item.completed ? "bg-green-500 border-green-500 text-white" : "border-fireflies-gray-300 hover:border-fireflies-purple"
        )}
      >
        {item.completed ? <Check className="w-3 h-3" /> : <Circle className="w-3 h-3 opacity-0" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", item.completed ? "text-fireflies-gray-400 line-through" : "text-fireflies-gray-800")}>
          {item.title}
        </p>
        {item.assignee && (
          <p className="text-xs text-fireflies-gray-400 mt-0.5">{item.assignee}</p>
        )}
      </div>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => onStartEdit(item)}
          className="text-fireflies-gray-400 hover:text-fireflies-purple p-1"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-fireflies-gray-400 hover:text-red-500 p-1"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
