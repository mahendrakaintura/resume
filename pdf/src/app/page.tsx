/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback } from "react";
import Rirekisho, { type RirekishoData } from "@/components/Rirekisho";

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
  education: [],
  work: [],
  skills: [],
  notes: "",
};

export default function Home() {
  const [saving, setSaving] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [data, setData] = useState<RirekishoData>(defaultValues);

  const handleChange = useCallback((patch: Partial<RirekishoData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

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
      alert("Saved");
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
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onSave} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save"}</button>
        <button onClick={onExport} className="btn">Export PDF (A4 x2)</button>
        <button onClick={onQuickExport} className="btn">Quick Export (no save)</button>
        {resumeId && <span className="text-sm text-gray-600">ID: {resumeId}</span>}
      </div>
      <div className="print-surface">
        <Rirekisho
          data={data}
          editable
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
