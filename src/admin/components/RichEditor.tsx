import { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Image as ImageIcon, Table as TableIcon, Undo, Redo, Minus, Quote } from 'lucide-react';
import { uploadImage } from '../../lib/api';

interface RichEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function RichEditor({
  value = '',
  onChange,
  placeholder = 'Tulis konten di sini...',
  label,
  className = '',
}: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Image.configure({
        HTMLAttributes: { class: 'editor-image' },
      }),
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const images = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (images.length === 0) return false;

        event.preventDefault();

        images.forEach(async (file) => {
          try {
            const result = await uploadImage(file);
            editor?.chain().focus().setImage({ src: result.url }).run();
          } catch (err) {
            console.error('Gagal upload gambar:', err);
          }
        });

        return true;
      },
      handlePaste: (_view, event) => {
        // Try to get images from clipboard
        const items = event.clipboardData?.items;
        if (items) {
          const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
          if (imageItems.length > 0) {
            event.preventDefault();
            imageItems.forEach(async (item) => {
              const file = item.getAsFile();
              if (file) {
                try {
                  const result = await uploadImage(file);
                  editor?.chain().focus().setImage({ src: result.url }).run();
                } catch (err) {
                  console.error('Gagal upload gambar:', err);
                }
              }
            });
            return true;
          }
        }

        // Fallback to files
        const files = event.clipboardData?.files;
        if (!files || files.length === 0) return false;

        const images = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (images.length === 0) return false;

        event.preventDefault();

        images.forEach(async (file) => {
          try {
            const result = await uploadImage(file);
            editor?.chain().focus().setImage({ src: result.url }).run();
          } catch (err) {
            console.error('Gagal upload gambar:', err);
          }
        });

        return true;
      },
    },
  });

  // Sync external value
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const result = await uploadImage(file);
        editor?.chain().focus().setImage({ src: result.url }).run();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Gagal mengunggah gambar.');
      }
    }

    e.target.value = '';
  }, [editor]);

  const addLink = () => {
    const url = window.prompt('Masukkan URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'}`}
      title={title}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-slate-200 mx-0.5" />;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      )}

      {/* Toolbar */}
      <div className="border border-slate-300 rounded-t-lg bg-slate-50 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={16} />
        </ToolbarButton>

        <Divider />

        {/* Heading */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <Divider />

        {/* Text Format */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          title="Code"
        >
          <Code size={16} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify size={16} />
        </ToolbarButton>

        <Divider />

        {/* List */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Insert Link">
          <LinkIcon size={16} />
        </ToolbarButton>

        {/* Image Upload */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
        >
          <ImageIcon size={16} />
        </ToolbarButton>

        {/* Table */}
        <ToolbarButton onClick={insertTable} title="Insert Table">
          <TableIcon size={16} />
        </ToolbarButton>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleFileSelect}
      />

      {/* Editor Content */}
      <style>{`
        .rich-editor-wrapper {
          display: flex;
          flex-direction: column;
        }
        .rich-editor-wrapper .ProseMirror {
          flex: 1;
          max-height: 500px;
          overflow-y: auto;
          padding: 1rem;
          border: 1px solid #cbd5e1;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          font-size: 0.875rem;
          line-height: 1.7;
          color: #334155;
          outline: none;
        }
        .rich-editor-wrapper .ProseMirror:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.15);
        }
        .rich-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          float: left;
          height: 0;
        }
        .rich-editor-wrapper .ProseMirror > * {
          max-width: 100%;
        }
        .rich-editor-wrapper .ProseMirror h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin: 1.5rem 0 0.75rem;
          line-height: 1.3;
        }
        .rich-editor-wrapper .ProseMirror h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #1e293b;
          margin: 1.25rem 0 0.5rem;
          line-height: 1.35;
        }
        .rich-editor-wrapper .ProseMirror h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #334155;
          margin: 1rem 0 0.5rem;
        }
        .rich-editor-wrapper .ProseMirror p {
          margin: 0.5rem 0;
        }
        .rich-editor-wrapper .ProseMirror ul,
        .rich-editor-wrapper .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-editor-wrapper .ProseMirror li {
          margin: 0.25rem 0;
        }
        .rich-editor-wrapper .ProseMirror blockquote {
          border-left: 4px solid #38bdf8;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #475569;
          font-style: italic;
          background: #f0f9ff;
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 0.75rem 1rem;
        }
        .rich-editor-wrapper .ProseMirror code {
          background: #f1f5f9;
          color: #e11d48;
          padding: 0.15rem 0.35rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.85em;
        }
        .rich-editor-wrapper .ProseMirror hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 1.5rem 0;
        }
        .rich-editor-wrapper .ProseMirror .editor-link {
          color: #0ea5e9;
          text-decoration: underline;
          cursor: pointer;
        }
        .rich-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.75rem 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: box-shadow 0.2s;
          display: block;
        }
        .rich-editor-wrapper .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #38bdf8;
          cursor: nwse-resize;
        }
        .rich-editor-wrapper .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #38bdf8;
          cursor: nwse-resize;
        }
        .rich-editor-wrapper .ProseMirror img.ProseMirror-resized {
          max-width: none;
        }

        /* Table Styles */
        .rich-editor-wrapper .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          table-layout: auto;
          max-width: 100%;
          overflow-x: auto;
          display: block;
        }
        .rich-editor-wrapper .ProseMirror table td,
        .rich-editor-wrapper .ProseMirror table th {
          border: 1px solid #cbd5e1;
          padding: 0.5rem 0.75rem;
          min-width: 80px;
          vertical-align: top;
          position: relative;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 300px;
        }
        .rich-editor-wrapper .ProseMirror table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #334155;
        }
        .rich-editor-wrapper .ProseMirror table .selectedCell:after {
          background: rgba(56, 189, 248, 0.1);
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          pointer-events: none;
          position: absolute;
        }
        .rich-editor-wrapper .ProseMirror .column-resize-handle {
          background-color: #38bdf8;
          bottom: -2px;
          position: absolute;
          right: -2px;
          pointer-events: none;
          top: 0;
          width: 5px;
        }
        .rich-editor-wrapper .ProseMirror .tableWrapper {
          margin: 1rem 0;
          overflow-x: auto;
        }
        .rich-editor-wrapper .ProseMirror .resize-cursor {
          cursor: colse-resize;
        }

        /* Selection */
        .rich-editor-wrapper .ProseMirror ::selection {
          background: rgba(56, 189, 248, 0.2);
        }
      `}</style>
      <div className="rich-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}