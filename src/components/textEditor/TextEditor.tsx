import { useEffect, useState } from "react";

import { dispatch, useDispatch, useSelector } from "@/store/store";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import { setSelectedNote } from "@/store/slices/note";


type INote = { content: string }

export const TextEditor = ({ note }: { note: INote | null }) => {
    const [showEditor, setShowEditor] = useState(false);
    const [content, setContent] = useState('');
    const dispatch = useDispatch()


    const editor = useEditor({
        extensions: [
            StarterKit,
            BulletList.configure({
                keepMarks: true,
                keepAttributes: false,
            }),
        ],
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none min-h-[400px]',
            },
        },
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
            dispatch(setSelectedNote({ ...note, content: editor.getText().replace(/\n+/g, "\n") }))
        },
    });


    useEffect(() => {
        if (note && editor) {
            const bulletPoints = note?.content
                .split('\n')
                .filter(line => line.trim())
                .map(line => `<li>${line.trim().replace(/^[-•]\s*/, '')}</li>`)
                .join('');
            editor.commands.setContent(`<ul>${bulletPoints}</ul>`);

        }
    }, [editor]);

    useEffect(() => {
        if(editor) {
            dispatch(setSelectedNote({ ...note, content: editor.getText().replace(/\n+/g, "\n") }))
        }
    }, [])

    return (
        <>
            <EditorContent editor={editor} controls />
        </>
    );
}
