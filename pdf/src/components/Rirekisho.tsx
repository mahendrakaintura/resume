"use client";
import React from "react";

export type RirekishoData = {
    name: string;
    furigana?: string;
    currentYear?: string;
    currentMonth?: string;
    currentDay?: string;
    birthYear?: string;
    birthMonth?: string;
    birthDay?: string;
    age?: string;
    gender?: string;
    nationality?: string;
    address?: string;
    addressFurigana?: string;
    phone?: string;
    email?: string;
    photoUrl?: string;
    education?: { from: string; to?: string; school: string; note?: string }[];
    work?: { from: string; to?: string; company: string; role?: string; note?: string }[];
    skills?: string[];
    notes?: string;
    qualifications?: { year: string; month: string; qualification: string }[];
    languages?: string[];
    specialty?: string; // 得意な科目・分野
    partTimeExperience?: string; // アルバイト経験
    selfPR?: string; // 自己PR
    motivation?: string; // 志望動機
    commuteMinutes?: string; // 通勤時間（分）
    dependents?: string; // 扶養家族数（配偶者除く）
    spouse?: "有" | "無"; // 配偶者の有無
    spouseDependent?: "有" | "無"; // 配偶者の扶養義務
    personalRequests?: string; // 本人希望記入欄
};

type Props = {
    data: RirekishoData;
    editable?: boolean;
    onChange?: (patch: Partial<RirekishoData>) => void;
};

const EditableCell = React.memo(
    ({
        field,
        value,
        editable,
        onChange,
        placeholder,
    }: {
        field: keyof RirekishoData;
        value?: string;
        editable: boolean;
        onChange?: (patch: Partial<RirekishoData>) => void;
        placeholder?: string;
    }) => {
        if (editable) {
            return (
                <input
                    type="text"
                    className="cell-input"
                    value={value || ""}
                    placeholder={placeholder || ""}
                    onChange={(e) => onChange?.({ [field]: e.target.value } as any)}
                    onFocus={(e) => e.target.select()}
                />
            );
        }
        return <div className="cell-display">{value || ""}</div>;
    }
);

export default function Rirekisho({ data, editable = false, onChange }: Props) {
    const fileRef = React.useRef<HTMLInputElement | null>(null);

    const onPickPhoto = () => {
        if (!editable) return;
        fileRef.current?.click();
    };

    const handlePhoto = async (file: File) => {
        const MM_TO_PX = 96 / 25.4;
        const targetW = Math.round(30 * MM_TO_PX);
        const targetH = Math.round(40 * MM_TO_PX);
        const bitmap = await createImageBitmap(file);
        const sw = bitmap.width,
            sh = bitmap.height;
        const scale = Math.max(targetW / sw, targetH / sh);
        const dw = Math.round(sw * scale),
            dh = Math.round(sh * scale);
        const dx = Math.round((targetW - dw) / 2),
            dy = Math.round((targetH - dh) / 2);
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(bitmap, dx, dy, dw, dh);
        const url = canvas.toDataURL("image/jpeg", 0.92);
        onChange?.({ photoUrl: url });
    };

    const updateEducation = (i: number, patch: Partial<NonNullable<RirekishoData["education"]>[number]>) => {
        const list = [...(data.education || [])];
        list[i] = { ...(list[i] || { from: "", to: "", school: "", note: "" }), ...patch };
        onChange?.({ education: list });
    };

    const updateWork = (i: number, patch: Partial<NonNullable<RirekishoData["work"]>[number]>) => {
        const list = [...(data.work || [])];
        list[i] = { ...(list[i] || { from: "", to: "", company: "", role: "", note: "" }), ...patch };
        onChange?.({ work: list });
    };

    return (
        <div className="text-black">
            {/* Page 1 */}
            <section className="a4 bg-white px-[8mm] pt-[6mm] pb-[6mm] rirekisho">
                {/* Title and date */}
                <div className="flex items-start justify-between pr-[30mm]">
                    <div className="r-title">履 歴 書</div>
                    <div className="text-[10pt] leading-tight mt-[2mm] mr-[6mm]">
                        <div className="flex items-center gap-[0mm] r-header-compact">
                            <div className="flex items-center gap-[1mm]">
                                <span className="inline-block w-[9mm]">
                                    <EditableCell
                                        field="currentYear"
                                        value={data.currentYear || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </span>
                                <span>年</span>
                            </div>
                            <div className="flex items-center gap-[1mm]">
                                <span className="inline-block w-[10mm]">
                                    <EditableCell
                                        field="currentMonth"
                                        value={data.currentMonth || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </span>
                                <span>月</span>
                            </div>
                            <div className="flex items-center gap-[1mm]">
                                <span className="inline-block w-[10mm]">
                                    <EditableCell
                                        field="currentDay"
                                        value={data.currentDay || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </span>
                                <span>日 現在</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top block with photo */}
                <div className="mt-[4mm] relative">
                    {/* Right: Photo */}
                    <div
                        className="photo-slot absolute right-[2mm] top-[-16mm]"
                        onClick={onPickPhoto}
                        role={editable ? "button" : undefined}
                        title={editable ? "写真をクリックしてアップロード" : undefined}
                    >
                        {data.photoUrl ? (
                            <img src={data.photoUrl} alt="photo" className="w-full h-full object-cover" />
                        ) : (
                            <div className="placeholder">
                                <div>
                                    <div className="text-[8pt] leading-tight">写真を貼る位置</div>
                                    <div className="mt-[8mm] text-[8pt] leading-tight">縦　40mm</div>
                                    <div className="text-[8pt] leading-tight">横　30mm</div>
                                </div>
                            </div>
                        )}
                        {editable && (
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) void handlePhoto(f);
                                }}
                            />
                        )}
                    </div>

                    {/* Main table structure matching the reference */}
                    <div className="pr-[34mm]">
                        <table className="w-full table-fixed border-collapse">
                            <colgroup>
                                <col style={{ width: "20mm" }} />
                                <col style={{ width: "calc(100% - 60mm)" }} />
                                <col style={{ width: "12mm" }} />
                                <col style={{ width: "23mm" }} />
                            </colgroup>
                            <tbody>
                                {/* Row: Furigana + Gender */}
                                <tr className="r-row-sm">
                                    <th className="cell label">フリガナ</th>
                                    <td className="cell" colSpan={2}>
                                        <EditableCell
                                            field="furigana"
                                            value={data.furigana || ""}
                                            editable={editable}
                                            onChange={onChange}
                                        />
                                    </td>
                                    <th className="cell label">性別</th>
                                </tr>
                                {/* Row: Name + Gender input */}
                                <tr className="r-row-lg">
                                    <th className="cell label">氏　名</th>
                                    <td className="cell" colSpan={2}>
                                        <EditableCell
                                            field="name"
                                            value={data.name || ""}
                                            editable={editable}
                                            onChange={onChange}
                                        />
                                    </td>
                                    <td className="cell">
                                        <EditableCell
                                            field="gender"
                                            value={data.gender || ""}
                                            editable={editable}
                                            onChange={onChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Second section: Birth date and nationality */}
                <div className="mt-[0mm]">
                    <table className="w-full table-fixed border-collapse">
                        <colgroup>
                            <col style={{ width: "20mm" }} />
                            <col style={{ width: "16mm" }} />
                            <col style={{ width: "8mm" }} />
                            <col style={{ width: "16mm" }} />
                            <col style={{ width: "8mm" }} />
                            <col style={{ width: "calc(100% - 80mm)" }} />
                            <col style={{ width: "12mm" }} />
                        </colgroup>
                        <tbody>
                            {/* Row: DOB + Nationality */}
                            <tr className="r-row-md">
                                <th className="cell label">生年月日</th>
                                <td className="cell text-center">
                                    <EditableCell
                                        field="birthYear"
                                        value={data.birthYear || ""}
                                        editable={editable}
                                        onChange={onChange}
                                        placeholder=""
                                    />
                                </td>
                                <td className="cell text-center text-[9pt]">年</td>
                                <td className="cell text-center">
                                    <EditableCell
                                        field="birthMonth"
                                        value={data.birthMonth || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </td>
                                <td className="cell text-center text-[9pt]">月</td>
                                <td className="cell">
                                    <div className="flex items-center gap-[1mm]">
                                        <span className="inline-block w-[12mm] text-center">
                                            <EditableCell
                                                field="birthDay"
                                                value={data.birthDay || ""}
                                                editable={editable}
                                                onChange={onChange}
                                            />
                                        </span>
                                        <span className="text-[9pt]">日生（満</span>
                                        <span className="inline-block w-[10mm] text-center">
                                            <EditableCell
                                                field="age"
                                                value={data.age || ""}
                                                editable={editable}
                                                onChange={onChange}
                                            />
                                        </span>
                                        <span className="text-[9pt]">歳）</span>
                                    </div>
                                </td>
                                <th className="cell label">国籍</th>
                                <td className="cell">
                                    <EditableCell
                                        field="nationality"
                                        value={data.nationality || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Address section */}
                <div className="mt-[0mm]">
                    <table className="w-full table-fixed border-collapse">
                        <colgroup>
                            <col style={{ width: "20mm" }} />
                            <col style={{ width: "calc(100% - 20mm)" }} />
                        </colgroup>
                        <tbody>
                            {/* Row: Address Furigana */}
                            <tr className="r-row-sm">
                                <th className="cell label">フリガナ</th>
                                <td className="cell">
                                    <EditableCell
                                        field="addressFurigana"
                                        value={data.addressFurigana || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </td>
                            </tr>

                            {/* Row: Address */}
                            <tr className="r-row-md">
                                <th className="cell label">現住所</th>
                                <td className="cell">
                                    <div className="flex items-center gap-[2mm]">
                                        <span className="text-[10pt]">〒</span>
                                        <EditableCell
                                            field="address"
                                            value={data.address || ""}
                                            editable={editable}
                                            onChange={onChange}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Phone and Email section */}
                <div className="mt-[0mm]">
                    <table className="w-full table-fixed border-collapse">
                        <colgroup>
                            <col style={{ width: "20mm" }} />
                            <col style={{ width: "calc(50% - 20mm)" }} />
                            <col style={{ width: "15mm" }} />
                            <col style={{ width: "calc(50% - 15mm)" }} />
                        </colgroup>
                        <tbody>
                            {/* Row: Phone + Email */}
                            <tr className="r-row-md">
                                <th className="cell label">電話番号</th>
                                <td className="cell">
                                    <EditableCell
                                        field="phone"
                                        value={data.phone || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </td>
                                <th className="cell label">E-mail</th>
                                <td className="cell">
                                    <EditableCell
                                        field="email"
                                        value={data.email || ""}
                                        editable={editable}
                                        onChange={onChange}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>                {/* Education/Work section (page 1 top portion) */}
                <div className="mt-[6mm]">
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr>
                                <th className="cell text-center w-[14mm]">年</th>
                                <th className="cell text-center w-[14mm]">月</th>
                                <th className="cell text-center">学　歴 ・ 職　歴（項目別にまとめて記入）</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.education || []).map((e, i) => (
                                <tr key={`edu-${i}`}>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input text-center"
                                                id={`edu-year-${i}`}
                                                value={(e.from || "").slice(0, 4)}
                                                onChange={(ev) => {
                                                    const y = ev.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                                                    const mm = (e.from || "").slice(5, 7);
                                                    updateEducation(i, { from: y ? `${y}-${mm}` : mm ? `-${mm}` : "" });
                                                }}
                                            />
                                        ) : (
                                            (e.from || "").slice(0, 4)
                                        )}
                                    </td>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input text-center"
                                                id={`edu-month-${i}`}
                                                value={(e.from || "").slice(5, 7)}
                                                onChange={(ev) => {
                                                    const raw = ev.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                                                    const mm = raw;
                                                    const yy = (e.from || "").slice(0, 4);
                                                    updateEducation(i, { from: yy ? `${yy}-${mm}` : mm ? `-${mm}` : "" });
                                                }}
                                            />
                                        ) : (
                                            (e.from || "").slice(5, 7)
                                        )}
                                    </td>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                className="cell-input"
                                                value={e.school || ""}
                                                onChange={(ev) => updateEducation(i, { school: ev.target.value })}
                                            />
                                        ) : (
                                            `${e.school}${e.to ? ` 〜 ${e.to}` : ""}`
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {Array.from({
                                length: 12, // Always show 12 empty rows between education and work
                            }).map((_, i) => {
                                return (
                                    <tr key={`empty-${i}`}>
                                        {editable ? (
                                            <>
                                                <td className="cell">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        className="cell-input text-center"
                                                        placeholder=""
                                                    />
                                                </td>
                                                <td className="cell">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        className="cell-input text-center"
                                                        placeholder=""
                                                    />
                                                </td>
                                                <td className="cell">
                                                    <input
                                                        type="text"
                                                        className="cell-input"
                                                        placeholder="学歴・職歴を入力"
                                                    />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="cell">&nbsp;</td>
                                                <td className="cell">&nbsp;</td>
                                                <td className="cell">&nbsp;</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                            {(data.work || []).map((w, i) => (
                                <tr key={`work-${i}`}>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input text-center"
                                                id={`work-year-${i}`}
                                                value={(w.from || "").slice(0, 4)}
                                                onChange={(ev) => {
                                                    const y = ev.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                                                    const mm = (w.from || "").slice(5, 7);
                                                    updateWork(i, { from: y ? `${y}-${mm}` : mm ? `-${mm}` : "" });
                                                }}
                                            />
                                        ) : (
                                            (w.from || "").slice(0, 4)
                                        )}
                                    </td>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input text-center"
                                                id={`work-month-${i}`}
                                                value={(w.from || "").slice(5, 7)}
                                                onChange={(ev) => {
                                                    const raw = ev.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                                                    const mm = raw;
                                                    const yy = (w.from || "").slice(0, 4);
                                                    updateWork(i, { from: yy ? `${yy}-${mm}` : mm ? `-${mm}` : "" });
                                                }}
                                            />
                                        ) : (
                                            (w.from || "").slice(5, 7)
                                        )}
                                    </td>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                className="cell-input"
                                                value={`${w.company}${w.role ? ` ／ ${w.role}` : ""}`}
                                                onChange={(ev) => {
                                                    const value = ev.target.value;
                                                    const [company, role] = value.split(" ／ ");
                                                    updateWork(i, { company: company || "", role: role || "" });
                                                }}
                                            />
                                        ) : (
                                            `${w.company} ${w.role ? `／ ${w.role}` : ""}`
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add buttons for education and work entries */}
                    {editable && (
                        <div className="mt-[4mm] flex gap-[4mm]">
                            <button
                                type="button"
                                className="btn btn-primary text-[9pt] px-[4mm] py-[1mm]"
                                onClick={() => {
                                    const edu = data.education || [];
                                    const work = data.work || [];
                                    const totalEntries = edu.length + work.length;

                                    const TOTAL_CAP = 22; // 12 base rows + 10 extra rows allowed
                                    if (totalEntries >= TOTAL_CAP) {
                                        alert("これ以上追加できません（上限 22 行）。");
                                        return;
                                    }

                                    // Add new education entry to WORK array so it appears last in table
                                    const newEducation = { from: "", to: "", company: "", role: "", note: "" };
                                    const updatedWork = [...work, newEducation];
                                    onChange?.({ work: updatedWork });

                                    setTimeout(() => {
                                        requestAnimationFrame(() => {
                                            const id = `work-year-${work.length}`;
                                            const el = document.getElementById(id) as HTMLInputElement | null;
                                            if (el) {
                                                el.focus();
                                                el.scrollIntoView({ behavior: "smooth", block: "end" });
                                            }
                                        });
                                    }, 100);
                                }}
                            >
                                + 学歴追加
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary text-[9pt] px-[4mm] py-[1mm]"
                                onClick={() => {
                                    const edu = data.education || [];
                                    const work = data.work || [];
                                    const totalEntries = edu.length + work.length;

                                    const TOTAL_CAP = 22; // 12 base rows + 10 extra rows allowed
                                    if (totalEntries >= TOTAL_CAP) {
                                        alert("これ以上追加できません（上限 22 行）。");
                                        return;
                                    }

                                    // Add new work entry at the end so it appears last in table
                                    const newWork = { from: "", to: "", company: "", role: "", note: "" };
                                    const updatedWork = [...work, newWork];
                                    onChange?.({ work: updatedWork });

                                    setTimeout(() => {
                                        requestAnimationFrame(() => {
                                            const id = `work-year-${work.length}`;
                                            const el = document.getElementById(id) as HTMLInputElement | null;
                                            if (el) {
                                                el.focus();
                                                el.scrollIntoView({ behavior: "smooth", block: "end" });
                                            }
                                        });
                                    }, 100);
                                }}
                            >
                                + 職歴追加
                            </button>
                        </div>
                    )}
                </div>

                <div className="page-break" />
            </section>

            {/* Page 2 - 履歴書 (続き) */}
            <section className="a4 bg-white px-[8mm] pt-[6mm] pb-[6mm] rirekisho">
                {/* Page indicator */}
                <div className="text-center mb-[6mm] text-[10pt] text-gray-600 border-b border-gray-300 pb-[2mm]">
                    履歴書 - 2ページ目
                </div>

                {/* 免許・資格 Section */}
                <div className="mt-[6mm]">
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr>
                                <th className="cell text-center w-[14mm]">年</th>
                                <th className="cell text-center w-[14mm]">月</th>
                                <th className="cell text-center">免許・資格</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({
                                length: 8, // Always show 8 empty rows for qualifications template
                            }).map((_, i) => {
                                return (
                                    <tr key={`empty-qual-${i}`}>
                                        {editable ? (
                                            <>
                                                <td className="cell">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        className="cell-input text-center"
                                                        placeholder=""
                                                    />
                                                </td>
                                                <td className="cell">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        className="cell-input text-center"
                                                        placeholder=""
                                                    />
                                                </td>
                                                <td className="cell">
                                                    <input
                                                        type="text"
                                                        className="cell-input"
                                                        placeholder="資格名を入力"
                                                    />
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="cell">&nbsp;</td>
                                                <td className="cell">&nbsp;</td>
                                                <td className="cell">&nbsp;</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                            {(data.qualifications || []).map((q, i) => (
                                <tr key={`qual-${i}`}>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input text-center"
                                                id={`qual-year-${i}`}
                                                value={q.year || ""}
                                                onChange={(ev) => {
                                                    const year = ev.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                                                    const newQuals = [...(data.qualifications || [])];
                                                    newQuals[i] = { ...newQuals[i], year };
                                                    onChange?.({ qualifications: newQuals });
                                                }}
                                            />
                                        ) : (
                                            q.year || ""
                                        )}
                                    </td>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input text-center"
                                                id={`qual-month-${i}`}
                                                value={q.month || ""}
                                                onChange={(ev) => {
                                                    const raw = ev.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                                                    const mm = raw ? raw.padStart(2, "0") : "";
                                                    const mmNum = mm ? Math.min(Math.max(parseInt(mm, 10), 1), 12) : 0;
                                                    const month = mmNum ? String(mmNum).padStart(2, "0") : raw;
                                                    const newQuals = [...(data.qualifications || [])];
                                                    newQuals[i] = { ...newQuals[i], month };
                                                    onChange?.({ qualifications: newQuals });
                                                }}
                                            />
                                        ) : (
                                            q.month || ""
                                        )}
                                    </td>
                                    <td className="cell">
                                        {editable ? (
                                            <input
                                                type="text"
                                                className="cell-input"
                                                id={`qual-qualification-${i}`}
                                                value={q.qualification || ""}
                                                onChange={(ev) => {
                                                    const qualificationText = ev.target.value;
                                                    const newQuals = [...(data.qualifications || [])];
                                                    newQuals[i] = { ...newQuals[i], qualification: qualificationText };
                                                    onChange?.({ qualifications: newQuals });
                                                }}
                                                placeholder="資格名を入力"
                                            />
                                        ) : (
                                            q.qualification || ""
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Add qualification button */}
                    {editable && (
                        <div className="mt-[4mm]">
                            <button
                                type="button"
                                className="btn btn-primary text-[9pt] px-[4mm] py-[1mm]"
                                onClick={() => {
                                    // Add new qualification entry at the end so it appears last in table
                                    const newQual = { year: "", month: "", qualification: "" };
                                    const updatedQualifications = [...(data.qualifications || []), newQual];
                                    onChange?.({ qualifications: updatedQualifications });

                                    setTimeout(() => {
                                        requestAnimationFrame(() => {
                                            const currentLength = (data.qualifications || []).length;
                                            const id = `qual-year-${currentLength}`;
                                            const el = document.getElementById(id) as HTMLInputElement | null;
                                            if (el) {
                                                el.focus();
                                                el.scrollIntoView({ behavior: "smooth", block: "end" });
                                            }
                                        });
                                    }, 100);
                                }}
                            >
                                + 資格追加
                            </button>
                        </div>
                    )}
                </div>

                {/* 対応言語 Section (single row as per design) */}
                <div className="mt-[8mm]">
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            <tr>
                                <th
                                    className="cell label w-[30mm]"
                                    style={{ borderRightStyle: "dotted" }}
                                >
                                    対応言語
                                </th>
                                <td className="cell" style={{ height: "12mm" }}>
                                    {editable ? (
                                        <input
                                            type="text"
                                            className="w-full border-none outline-none text-[9pt] px-[2mm]"
                                            value={(data.languages || []).join("、")}
                                            onChange={(e) => {
                                                const arr = e.target.value
                                                    .split(/[,、]/)
                                                    .map((s) => s.trim())
                                                    .filter(Boolean);
                                                onChange?.({ languages: arr });
                                            }}
                                            placeholder=""
                                        />
                                    ) : (
                                        <div className="text-[9pt] px-[2mm]">{(data.languages || []).join("、")}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 得意な科目・分野 / アルバイト経験 */}
                <div className="mt-[6mm]">
                    <table className="w-full border-collapse table-fixed">
                        <colgroup>
                            <col style={{ width: "50%" }} />
                            <col style={{ width: "50%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="cell label" style={{ borderRightStyle: "dotted" }}>得意な科目・分野</th>
                                <th className="cell label">アルバイト経験</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="cell align-top p-[2mm]" style={{ height: "28mm", borderRightStyle: "dotted" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none text-[9pt]"
                                            value={data.specialty || ""}
                                            onChange={(e) => onChange?.({ specialty: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-[9pt] whitespace-pre-wrap">{data.specialty}</div>
                                    )}
                                </td>
                                <td className="cell align-top p-[2mm]" style={{ height: "28mm" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none text-[9pt]"
                                            value={data.partTimeExperience || ""}
                                            onChange={(e) => onChange?.({ partTimeExperience: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-[9pt] whitespace-pre-wrap">{data.partTimeExperience}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 自己PR */}
                <div className="mt-[6mm]">
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            <tr>
                                <th className="cell label w-[30mm] text-left" style={{ borderBottomStyle: "dotted", textAlign: "left" }}>自己ＰＲ</th>
                            </tr>
                            <tr>
                                <td className="cell p-[2mm]" style={{ height: "40mm", borderTop: "0" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none text-[9pt]"
                                            value={data.selfPR || ""}
                                            onChange={(e) => onChange?.({ selfPR: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-[9pt] whitespace-pre-wrap">{data.selfPR}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 志望動機 */}
                <div className="mt-[6mm]">
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            <tr>
                                <th className="cell label w-[30mm] text-left" style={{ borderBottomStyle: "dotted", textAlign: "left" }}>志望動機</th>
                            </tr>
                            <tr>
                                <td className="cell p-[2mm]" style={{ height: "40mm", borderTop: "0" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none text-[9pt]"
                                            value={data.motivation || ""}
                                            onChange={(e) => onChange?.({ motivation: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-[9pt] whitespace-pre-wrap">{data.motivation}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 通勤時間 / 扶養家族数 / 配偶者の有無 / 配偶者の扶養義務 */}
                <div className="mt-[8mm] avoid-break">
                    <table className="w-full border-collapse table-fixed">
                        <colgroup>
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th className="cell label">通勤時間</th>
                                <th className="cell label">扶養家族数（配偶者を除く）</th>
                                <th className="cell label">配偶者の有無</th>
                                <th className="cell label">配偶者の扶養義務</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="cell">
                                    <div className="flex items-center gap-[2mm] justify-center">
                                        <span className="text-[9pt] text-gray-700">約</span>
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input w-[16mm] text-center text-[9pt]"
                                                value={data.commuteMinutes || ""}
                                                onChange={(e) => onChange?.({ commuteMinutes: e.target.value.replace(/[^0-9]/g, "") })}
                                            />
                                        ) : (
                                            <span className="text-[9pt] inline-block w-[16mm] text-center">{data.commuteMinutes}</span>
                                        )}
                                        <span className="text-[9pt] text-gray-700">分</span>
                                    </div>
                                </td>
                                <td className="cell">
                                    <div className="flex items-center gap-[2mm] justify-center">
                                        {editable ? (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                className="cell-input w-[16mm] text-center text-[9pt]"
                                                value={data.dependents || ""}
                                                onChange={(e) => onChange?.({ dependents: e.target.value.replace(/[^0-9]/g, "") })}
                                            />
                                        ) : (
                                            <span className="text-[9pt] inline-block w-[16mm] text-center">{data.dependents}</span>
                                        )}
                                        <span className="text-[9pt] text-gray-700">人</span>
                                    </div>
                                </td>
                                <td className="cell">
                                    <div className="flex items-center justify-center gap-[8mm] text-[9pt]">
                                        {editable ? (
                                            <>
                                                <label className="flex items-center gap-[2mm] cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="spouse"
                                                        value="有"
                                                        checked={data.spouse === "有"}
                                                        onChange={() => onChange?.({ spouse: "有" })}
                                                    />
                                                    <span>有</span>
                                                </label>
                                                <label className="flex items-center gap-[2mm] cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="spouse"
                                                        value="無"
                                                        checked={data.spouse === "無"}
                                                        onChange={() => onChange?.({ spouse: "無" })}
                                                    />
                                                    <span>無</span>
                                                </label>
                                            </>
                                        ) : (
                                            <>
                                                <span className="min-w-[14mm] text-center">{data.spouse === "有" ? "◯" : "○"} 有</span>
                                                <span className="min-w-[14mm] text-center">{data.spouse === "無" ? "◯" : "○"} 無</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="cell">
                                    <div className="flex items-center justify-center gap-[8mm] text-[9pt]">
                                        {editable ? (
                                            <>
                                                <label className="flex items-center gap-[2mm] cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="spouseDependent"
                                                        value="有"
                                                        checked={data.spouseDependent === "有"}
                                                        onChange={() => onChange?.({ spouseDependent: "有" })}
                                                    />
                                                    <span>有</span>
                                                </label>
                                                <label className="flex items-center gap-[2mm] cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="spouseDependent"
                                                        value="無"
                                                        checked={data.spouseDependent === "無"}
                                                        onChange={() => onChange?.({ spouseDependent: "無" })}
                                                    />
                                                    <span>無</span>
                                                </label>
                                            </>
                                        ) : (
                                            <>
                                                <span className="min-w-[14mm] text-center">{data.spouseDependent === "有" ? "◯" : "○"} 有</span>
                                                <span className="min-w-[14mm] text-center">{data.spouseDependent === "無" ? "◯" : "○"} 無</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 本人希望記入欄 */}
                <div className="mt-[6mm] avoid-break">
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            <tr>
                                <th className="cell label">
                                    本人希望記入欄（特に給与・職種・勤務時間・勤務地・その他についての希望などがあれば記入）
                                </th>
                            </tr>
                            <tr>
                                <td className="cell p-[2mm]" style={{ height: "24mm" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none text-[9pt]"
                                            value={data.personalRequests || ""}
                                            onChange={(e) => onChange?.({ personalRequests: e.target.value })}
                                        />
                                    ) : (
                                        <div className="text-[9pt] whitespace-pre-wrap">{data.personalRequests}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
