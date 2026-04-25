"use client"

import { Input } from "@/components/ui/input"
import { BookText, Compass, User } from "lucide-react"
import Image from "next/image";
import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";

const countries = ["Germany", "Canada", "United States", "Russia", "India"];

type UploadedFile = {
    file: File;
    preview: string;
};

const PersonalInfo = () => {
    const [isOpenFirst, setIsOpenFirst] = useState(false);
    const [isOpenSecond, setIsOpenSecond] = useState(false);
    const [selectedFirst, setSelectedFirst] = useState("Select");
    const [selectedSecond, setSelectedSecond] = useState("select")
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
    const [dragging, setDragging] = useState(false);

    const processFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        const allowed = ["image/jpeg", "image/png", "application/pdf"];
        Array.from(files).forEach((file) => {
            if (!allowed.includes(file.type)) return;
            if (file.size > 10 * 1024 * 1024) return;
            const preview = file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : "";
            setUploaded((prev) => [...prev, { file, preview }]);
        });
    }, []);

    const onDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragging(false);
            processFiles(e.dataTransfer.files);
        },
        [processFiles]
    );

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const onDragLeave = () => setDragging(false);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        e.target.value = "";
    };

    const remove = (index: number) => {
        setUploaded((prev) => {
            const copy = [...prev];
            if (copy[index].preview) URL.revokeObjectURL(copy[index].preview);
            copy.splice(index, 1);
            return copy;
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };


    const handleSelectFirst = (country) => {
        setSelectedFirst(country);
        setIsOpenFirst(false);
    };
    const handleSelectSecond = (country) => {
        setSelectedSecond(country);
        setIsOpenSecond(false);
    };

    return (
        <div className="w-full flex flex-col items-start max-w-3xl m-auto pt-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl">Get Personalized Recommendations,</h2>
                <p>Complete your academic profile to let our AI match you with the best-fit universities worldwide.</p>
            </div>
            <div className="w-full my-8">
                <div className="w-full flex flex-col mb-3 items-start shadow dark:shadow-white p-5 rounded-lg">
                    <h1 className="flex gap-2"><User className="text-green-500" /> Personal Info</h1>
                    <div className="flex w-full gap-5 my-3">
                        <div className="w-full">
                            <label htmlFor="full_name">Full Name: </label>
                            <Input placeholder="Full Name" id="full_name" className=" w-full mt-2" autoComplete="true" required />
                        </div>
                        <div className="w-full">
                            <label htmlFor="phone">Phone: </label>
                            <Input placeholder="+977 9876543210" id="phone" className="mt-2" autoCapitalize="true" required />
                        </div>
                    </div>
                    <div className="w-full">
                        <label htmlFor="college">Current School/Institution </label>
                        <Input placeholder="Name of your high school or current university" id="college" className="mt-2" autoCapitalize="true" required />
                    </div>
                </div>
                <div className="w-full flex flex-col mb-3 items-start shadow dark:shadow-white p-5 rounded-lg">
                    <h1 className="flex gap-2"><Compass className="text-green-500" /> Preferences</h1>
                    <div className="flex flex-col w-full gap-5 my-3">
                        <div className="flex w-full gap-5">
                            <div className="flex flex-col w-full text-sm relative">
                                <label className="mb-2">Country of First Choice</label>
                                <button type="button" onClick={() => setIsOpenFirst(!isOpenFirst)}
                                    className="w-full text-left px-4 pr-2 py-2 border rounded dark:bg-black bg-white text-gray-400 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
                                >
                                    <span>{selectedFirst}</span>
                                    <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isOpenFirst ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280" >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isOpenFirst && (
                                    <ul className="w-full bg-white absolute top-16 dark:bg-black border border-gray-300 rounded shadow-md mt-1 py-2">
                                        {countries.map((country) => (
                                            <li key={country} className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer" onClick={() => handleSelectFirst(country)} >
                                                {country}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex flex-col w-full text-sm relative">
                                <label className="mb-2">Country of First Choice</label>
                                <button type="button" onClick={() => setIsOpenSecond(!isOpenSecond)}
                                    className="w-full text-left px-4 pr-2 py-2 border rounded dark:bg-black bg-white text-gray-400 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
                                >
                                    <span>{selectedSecond}</span>
                                    <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isOpenSecond ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280" >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isOpenSecond && (
                                    <ul className="w-full bg-white absolute top-16 dark:bg-black border border-gray-300 rounded shadow-md mt-1 py-2">
                                        {countries.map((country) => (
                                            <li key={country} className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer" onClick={() => handleSelectSecond(country)} >
                                                {country}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <div className="w-full">
                                <label htmlFor="target_college">Targeted University(optional) </label>
                                <Input placeholder="e.g Cambridge university" id="college" className="mt-2" autoCapitalize="true" />
                            </div>
                            <div className="w-full">
                                <label htmlFor="target_college">Program Choice: </label>
                                <Input placeholder="e.g BCs Computer Science" id="college" className="mt-2" autoCapitalize="true" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col mb-3 items-start shadow dark:shadow-white p-5 rounded-lg">
                    <h1 className="flex gap-2"><BookText className="text-green-500" /> Academic Record</h1>
                    <div className="w-full my-5">
                        <div className="min-h-fit w-full text-center rounded-xl dark:bg-[#101010] bg-[#f8f8f8] flex items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
                            <div className="w-full max-w-xl space-y-4">
                                {/* Header */}
                                <div className="mb-6">
                                    <p className="text-xs tracking-[0.25em] uppercase text-[#8a7f70] font-medium">
                                        Document Upload
                                    </p>
                                    <h1 className="text-2xl font-semibold text-white mt-1">
                                        Upload Transcripts
                                    </h1>
                                </div>

                                {/* Drop Zone */}
                                <div
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onClick={() => inputRef.current?.click()}
                                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-10 flex flex-col items-center justify-center text-center gap-3 group ${dragging ? "border-[#b5a48a] dark:bg-[#282828]  bg-[#ede9e0] scale-[1.01]" : "border-[#cfc9bc] dark:bg-black text-white bg-white hover:border-[#b5a48a] hover:bg-[#faf8f4]"}`}
                                >
                                    {/* Upload Icon */}
                                    <div
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${dragging ? "bg-[#e0d8cc]" : "bg-[#f0ece4] group-hover:bg-[#e8e2d8]"}`}
                                    >
                                        <svg
                                            className={`w-6 h-6 transition-all duration-300 ${dragging ? "text-[#7a6e5f] -translate-y-0.5" : "text-[#9a8e7e] group-hover:-translate-y-0.5"}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={1.8}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 16v-8m0 0-3 3m3-3 3 3M6.5 19a4.5 4.5 0 0 1-.25-8.99A5.5 5.5 0 0 1 17.45 10H18a4 4 0 0 1 .25 7.98"
                                            />
                                        </svg>
                                    </div>

                                    <div>
                                        <p className="text-[#2c2a26] font-medium text-sm">
                                            Drop files here or{" "}
                                            <span className="text-[#7a6e5f] underline underline-offset-2">
                                                browse
                                            </span>
                                        </p>
                                        <p className="text-[#a09484] text-xs mt-1">
                                            PDF, JPEG or PNG · Max size 10 MB
                                        </p>
                                    </div>

                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        multiple
                                        className="hidden"
                                        onChange={onChange}
                                    />
                                </div>

                                {/* Previews */}
                                {uploaded.length > 0 && (
                                    <div className="space-y-2">
                                        {uploaded.map((item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 dark:bg-[#111111]  bg-white rounded-xl border border-[#e2ddd5] px-4 py-3 group transition-all hover:border-[#cfc9bc]"
                                            >
                                                {/* Thumbnail or PDF icon */}
                                                <div className="w-12 h-12 rounded-lg overflow-hidden text-white flex-shrink-0 dark:bg-[#111111] bg-[#f0ece4] flex items-center justify-center">
                                                    {item.preview ? (
                                                        <img
                                                            src={item.preview}
                                                            alt={item.file.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <svg
                                                            className="w-6 h-6 text-[#c4443a]"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                                                        </svg>
                                                    )}
                                                </div>

                                                {/* File info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-[#2c2a26] dark:text-white truncate">
                                                        {item.file.name}
                                                    </p>
                                                    <p className="text-xs text-[#a09484] mt-0.5">
                                                        {formatSize(item.file.size)}
                                                    </p>
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        remove(i);
                                                    }}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#c4b8a8] hover:text-[#7a6e5f] hover:bg-[#f0ece4] transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full mt-3 gap-4">
                            <div>
                                <label htmlFor="sat">SAT Score: </label>
                                <Input placeholder="1600" id="sat" className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="act">ACT Score: </label>
                                <Input placeholder="36" id="act" className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="ielts">IELTS Score: </label>
                                <Input placeholder="9.0" id="ielts" className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="toefl">TOEFL Score: </label>
                                <Input placeholder="120" id="toefl" className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfo