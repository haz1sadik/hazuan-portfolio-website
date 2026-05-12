'use client';

import { useCallback, useRef, useState } from "react";

const ThumbnailUpload = ({
    label = "Thumbnail",
    value,
    onChange,
    onUpload,
    disabled = false,
}) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFiles = useCallback(
        async (files) => {
            const file = files?.[0];
            if (!file || !onUpload) return;
            setError(null);
            try {
                setIsUploading(true);
                const url = await onUpload(file);
                onChange?.(url);
            } catch (err) {
                setError(err?.message || "Failed to upload thumbnail.");
            } finally {
                setIsUploading(false);
            }
        },
        [onChange, onUpload]
    );

    const handleInputChange = (event) => {
        handleFiles(event.target.files);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (disabled || isUploading) return;
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        if (disabled || isUploading) return;
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = () => {
        onChange?.("");
        setError(null);
    };

    const openFileDialog = () => {
        if (disabled || isUploading) return;
        inputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-md text-black">{label}</label>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-6 text-sm transition ${isDragging
                        ? "border-hazuan-primary bg-hazuan-primary/5"
                        : "border-gray-200 bg-gray-50"
                    } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                onClick={openFileDialog}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openFileDialog();
                    }
                }}
            >
                {value ? (
                    <div className="flex w-full flex-col items-center gap-4">
                        <img
                            src={value}
                            alt="Thumbnail preview"
                            className="h-40 w-full max-w-xl rounded-xl object-cover shadow"
                        />
                        <span className="text-xs text-gray-500">
                            Drag & drop to replace, or click to choose another file
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-center text-gray-500">
                        <span className="text-sm font-medium">
                            Drag & drop an image here
                        </span>
                        <span className="text-xs">or click to browse</span>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                    disabled={disabled || isUploading}
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={openFileDialog}
                    disabled={disabled || isUploading}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-hazuan-primary hover:text-hazuan-primary disabled:cursor-not-allowed"
                >
                    {isUploading ? "Uploading..." : value ? "Replace thumbnail" : "Upload thumbnail"}
                </button>
                {value && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={disabled || isUploading}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed"
                    >
                        Remove thumbnail
                    </button>
                )}
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default ThumbnailUpload;
