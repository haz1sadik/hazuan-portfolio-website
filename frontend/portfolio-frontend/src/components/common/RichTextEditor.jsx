'use client';

import { useCallback, useEffect, useRef } from "react";

const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
];

const RichTextEditor = ({ value, onChange, onImageUpload, placeholder }) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const onImageUploadRef = useRef(onImageUpload);

    useEffect(() => {
        onChangeRef.current = onChange;
        onImageUploadRef.current = onImageUpload;
    }, [onChange, onImageUpload]);

    const handleImageUpload = useCallback(async () => {
        if (!onImageUploadRef.current || !quillRef.current) return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const imageUrl = await onImageUploadRef.current(file);
                if (!imageUrl) return;
                const quill = quillRef.current;
                if (!quill || !quill.root?.isConnected) return;

                const range = quill.getSelection();
                const index = range ? range.index : quill.getLength();
                quill.insertEmbed(index, "image", imageUrl, "user");

                if (quill.hasFocus() && quill.root?.isConnected) {
                    quill.setSelection(index + 1, 0, "silent");
                }
            } catch (error) {
                console.error("Failed to upload image", error);
            }
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initQuill = async () => {
            if (!containerRef.current || quillRef.current) return;
            const Quill = (await import("quill")).default;

            if (!isMounted) return;

            const quill = new Quill(containerRef.current, {
                theme: "snow",
                placeholder,
                modules: {
                    toolbar: {
                        container: toolbarOptions,
                        handlers: {
                            image: handleImageUpload,
                        },
                    },
                },
            });

            quill.on("text-change", () => {
                const html = quill.root.innerHTML;
                onChangeRef.current?.(html);
            });

            if (value) {
                quill.clipboard.dangerouslyPasteHTML(value);
            }

            quillRef.current = quill;
        };

        initQuill();

        return () => {
            isMounted = false;
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
            quillRef.current = null;
        };
    }, [handleImageUpload, placeholder]);

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill) return;
        const current = quill.root.innerHTML;
        if (value !== undefined && value !== current) {
            const selection = quill.getSelection();
            quill.root.innerHTML = value || "";
            if (selection) {
                quill.setSelection(selection);
            }
        }
    }, [value]);

    return (
        <div className="w-full rounded-2xl border-2 border-[#a8b9c7] bg-white">
            <div ref={containerRef} className="min-h-64" />
        </div>
    );
};

export default RichTextEditor;