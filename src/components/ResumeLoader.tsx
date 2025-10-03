"use client";
import { useState } from "react";

interface ResumeLoaderProps {
    onLoad: (data: any, resumeId: string) => void;
}

export default function ResumeLoader({ onLoad }: ResumeLoaderProps) {
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);

    const loadResume = async () => {
        if (!searchId.trim()) {
            alert("Please enter a Resume ID");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/resumes/${searchId.trim()}`);

            if (!res.ok) {
                if (res.status === 404) {
                    alert("Resume not found. Please check your ID.");
                } else {
                    alert("Failed to load resume. Please try again.");
                }
                return;
            }

            const resume = await res.json();
            onLoad(resume.data, resume.id);
            alert("Resume loaded successfully!");
            setSearchId(""); // Clear search after successful load
        } catch (error) {
            alert("Error loading resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Header with icon */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Load Existing Resume</h3>
                        <p className="text-xs text-gray-600">Enter your saved Resume ID to restore data</p>
                    </div>
                </div>

                {/* Input and button */}
                <div className="flex items-center gap-3 w-full lg:w-auto lg:flex-shrink-0">
                    <div className="relative flex-1 lg:w-80">
                        <input
                            type="text"
                            placeholder="Enter your id here"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8 placeholder-gray-500"
                            onKeyPress={(e) => e.key === "Enter" && loadResume()}
                        />
                        {searchId && (
                            <button
                                onClick={() => setSearchId("")}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={loadResume}
                        disabled={loading || !searchId.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span>Load</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}