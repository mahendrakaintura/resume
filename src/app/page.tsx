/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback, useEffect } from "react";
import Rirekisho, { type RirekishoData } from "@/components/Rirekisho";
import ResumeLoader from "@/components/ResumeLoader";

const defaultValues: RirekishoData = {
  name: "",
  furigana: "",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  age: "",
  gender: "",
  nationality: "",
  address: "",
  addressFurigana: "",
  phone: "",
  email: "",
  education: [], // Start with empty - user will add as needed
  work: [],
  skills: [],
  notes: "",
  qualifications: [], // Start with empty - user will add as needed
};

export default function Home() {
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [showId, setShowId] = useState(false);
  const [data, setData] = useState<RirekishoData>(defaultValues);
  const [isFirstSave, setIsFirstSave] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load draft from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rirekisho:draft");
      const savedId = localStorage.getItem("rirekisho:savedId");

      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setData((prev) => ({ ...prev, ...parsed }));
        }
      }

      if (savedId) {
        setResumeId(savedId);
        setIsFirstSave(false); // Resume already exists, so not first save
      }
    } catch { /* ignore */ }
  }, []);

  // Autosave draft whenever data changes (debounced slightly)
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem("rirekisho:draft", JSON.stringify(data));
      } catch { /* ignore */ }
    }, 200);
    return () => clearTimeout(id);
  }, [data]);

  const handleChange = useCallback((patch: Partial<RirekishoData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  // Copy Resume ID to clipboard
  const copyResumeId = () => {
    if (resumeId) {
      navigator.clipboard.writeText(resumeId);
      alert("Resume ID copied to clipboard!");
    }
  };

  // Handle loading resume from ResumeLoader component
  const handleResumeLoad = (resumeData: RirekishoData, loadedResumeId: string) => {
    setData(resumeData);
    setResumeId(loadedResumeId);
    setIsFirstSave(false);
    setShowSaveSuccess(false);
    localStorage.setItem("rirekisho:savedId", loadedResumeId);
  };    const onClear = () => {
    localStorage.removeItem("rirekisho:draft");
    localStorage.removeItem("rirekisho:savedId");
    const freshData = {
      name: "",
      furigana: "",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      age: "",
      gender: "",
      nationality: "",
      address: "",
      addressFurigana: "",
      phone: "",
      email: "",
      education: [],
      work: [],
      qualifications: [],
      notes: "",
      skills: []
    };
    setData(freshData);
    setResumeId(null);
    setIsFirstSave(true);
    setShowSaveSuccess(false);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const body = { title: (data.name || "履歴書") + " 履歴書", template: "rirekisho-v1", data };
      const res = await fetch(resumeId ? `/api/resumes/${resumeId}` : "/api/resumes", {
        method: resumeId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(json));

      setResumeId(json.id);
      localStorage.setItem("rirekisho:savedId", json.id);

      // Only show popup on first save or if it's a new resume
      if (isFirstSave || !resumeId) {
        alert(`Saved! Your Resume ID: ${json.id}`);
        setIsFirstSave(false);
      } else {
        // Show non-intrusive feedback for subsequent saves
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 2000);
      }
    } catch (e: any) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const onExport = () => {
    if (!resumeId) return alert("Please save first");
    window.open(`/api/resumes/${resumeId}/pdf`, "_blank");
  };

  const onQuickExport = async () => {
    // If already saved, reuse the print-based export for perfect layout parity
    if (resumeId) {
      window.open(`/api/resumes/${resumeId}/pdf`, "_blank");
      return;
    }
    // Fallback: legacy quick export (may differ in layout); recommend saving for exact match
    const payload = { title: (data.name || "履歴書") + " (Quick)", data };
    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text();
      return alert("Export failed: " + t);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Scrolls with page */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3">
          {/* First row - Save/Clear buttons and Resume ID */}
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={onSave} disabled={saving} className="btn-primary relative">
              {saving ? "Saving..." : "Save"}
              {showSaveSuccess && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  ✓
                </span>
              )}
            </button>
            <button onClick={onClear} className="btn text-red-600 border-red-300">
              Clear
            </button>

            {/* Resume ID display */}
            {resumeId && (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded border">
                <span className="text-sm text-green-700">
                  Your ID: {showId ? resumeId : "••••••••"}
                </span>
                <button
                  onClick={() => setShowId(!showId)}
                  className="text-xs text-green-600 hover:underline"
                >
                  {showId ? "Hide" : "Show"}
                </button>
                <button
                  onClick={copyResumeId}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                >
                  Copy
                </button>
              </div>
            )}

            <button onClick={onExport} className="btn">Export PDF (A4 x2)</button>
            <button onClick={onQuickExport} className="btn">Quick Export (no save)</button>
          </div>

          {/* Second row - Resume Loader */}
          <ResumeLoader onLoad={handleResumeLoad} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-6">
        <div className="print-surface">
          <Rirekisho
            data={data}
            editable
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
