// components/RichEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

interface EditorEntry {
    id: number;
    content: string;
}

export default function RichEditorManager() {
    const [entries, setEntries] = useState<EditorEntry[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                class:
                    "min-h-[150px] border rounded p-3 focus:outline-none prose max-w-none",
            },
        },
        immediatelyRender: false,
    });

    const saveEntry = () => {
        if (!editor) return;
        const html = editor.getHTML();

        if (activeIndex !== null) {
            // Update existing entry by index
            setEntries((prev) =>
                prev.map((entry, i) =>
                    i === activeIndex ? { ...entry, content: html } : entry
                )
            );
        } else {
            // Add new entry
            setEntries((prev) => [
                ...prev,
                { id: Date.now(), content: html },
            ]);
        }

        editor.commands.clearContent();
        setActiveIndex(null);
    };

    const loadEntry = (index: number) => {
        if (!editor) return;
        setActiveIndex(index);
        editor.commands.setContent(entries[index].content);
    };

    const deleteEntry = (index: number) => {
        setEntries((prev) => prev.filter((_, i) => i !== index));
        if (activeIndex === index) {
            editor?.commands.clearContent();
            setActiveIndex(null);
        }
    };

    const parseToItems = (html: string): string[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const items: string[] = [];

        doc.body.querySelectorAll("p, li").forEach((el) => {
            const inner = el.innerHTML?.trim();
            if (inner) items.push(inner);
        });

        return items;
    };

    console.log(entries)

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            {/* Toolbar */}
            <div className="flex gap-2 flex-wrap border-b pb-2">
                <button onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`px-2 py-1 border rounded text-sm ${editor?.isActive("bold") ? "bg-black text-white" : ""}`}>
                    Bold
                </button>
                <button onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`px-2 py-1 border rounded text-sm ${editor?.isActive("italic") ? "bg-black text-white" : ""}`}>
                    Italic
                </button>
                <button onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 border rounded text-sm ${editor?.isActive("bulletList") ? "bg-black text-white" : ""}`}>
                    List
                </button>
                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 border rounded text-sm ${editor?.isActive("heading", { level: 2 }) ? "bg-black text-white" : ""}`}>
                    H2
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />

            <div className="flex gap-2">
                <button onClick={saveEntry}
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                    {activeIndex !== null ? `Update [${activeIndex}]` : "Save"}
                </button>
                {activeIndex !== null && (
                    <button onClick={() => { editor?.commands.clearContent(); setActiveIndex(null); }}
                        className="px-4 py-2 border rounded text-sm">
                        Cancel
                    </button>
                )}
            </div>

            {/* Render stored entries by index */}
            <div className="space-y-3">
                {entries.map((entry, index) => (
                    <div key={entry.id}
                        className={`border rounded p-3 ${activeIndex === index ? "border-blue-500" : ""}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500 font-mono">entries[{index}]</span>
                            <div className="flex gap-2">
                                <button onClick={() => loadEntry(index)}
                                    className="text-xs px-2 py-1 border rounded">Edit</button>
                                <button onClick={() => deleteEntry(index)}
                                    className="text-xs px-2 py-1 border rounded text-red-500">Delete</button>
                            </div>
                        </div>
                        {/* Render HTML from TipTap */}
                        <div
                            className="prose max-w-none text-sm"
                            dangerouslySetInnerHTML={{ __html: entry.content }}
                        />
                    </div>
                ))}
            </div>
            <div>
                {entries.map((entry) => {
                    const items = parseToItems(entry.content);
                    return items.map((item, index) => (
                        <div key={index}>
                            {index}: {item}
                            <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: item }} />
                        </div>
                    ));
                })}
            </div>
        </div>
    );
}