"use client";
import React from "react";

// Auto-compact helper function to adjust font size based on content length
const getAutoCompactStyle = (text: string | undefined, maxLength: number = 50): React.CSSProperties => {
    const contentLength = text?.length || 0;
    if (contentLength > maxLength * 2) {
        return { fontSize: '7pt', lineHeight: 1.2 };
    } else if (contentLength > maxLength) {
        return { fontSize: '8pt', lineHeight: 1.25 };
    }
    return { fontSize: '9pt', lineHeight: 1.3 };
};

// Auto-compact textarea component
const AutoCompactTextarea = ({
    value,
    onChange,
    editable,
    placeholder,
    minHeight = "52mm",
    maxLength = 50
}: {
    value?: string;
    onChange?: (value: string) => void;
    editable: boolean;
    placeholder?: string;
    minHeight?: string;
    maxLength?: number;
}) => {
    const compactStyle = getAutoCompactStyle(value, maxLength);

    if (editable) {
        return (
            <textarea
                className="w-full resize-none border-none outline-none"
                style={{ ...compactStyle, minHeight }}
                value={value || ""}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
            />
        );
    }
    return (
        <div className="text-[9pt] whitespace-pre-wrap h-full" style={compactStyle}>
            {value}
        </div>
    );
};

// Auto-compact input component
const AutoCompactInput = ({
    value,
    onChange,
    editable,
    placeholder,
    className = "",
    textAlign = "left" as const
}: {
    value?: string;
    onChange?: (value: string) => void;
    editable: boolean;
    placeholder?: string;
    className?: string;
    textAlign?: "left" | "center" | "right";
}) => {
    const compactStyle = getAutoCompactStyle(value, 30);

    if (editable) {
        return (
            <input
                type="text"
                className={`cell-input ${className}`}
                style={{ ...compactStyle, textAlign }}
                value={value || ""}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
            />
        );
    }
    return (
        <div className={`cell-display ${className}`} style={{ ...compactStyle, justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
            {value || ""}
        </div>
    );
};

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
        className,
    }: {
        field: keyof RirekishoData;
        value?: string;
        editable: boolean;
        onChange?: (patch: Partial<RirekishoData>) => void;
        placeholder?: string;
        className?: string;
    }) => {
        if (editable) {
            return (
                <input
                    type="text"
                    className={`cell-input ${className || ""}`}
                    value={value || ""}
                    placeholder={placeholder || ""}
                    onChange={(e) => onChange?.({ [field]: e.target.value } as any)}
                    onFocus={(e) => e.target.select()}
                />
            );
        }
        return <div className={`cell-display ${className || ""}`}>{value || ""}</div>;
    }
);

export default function Rirekisho({ data, editable = false, onChange }: Props) {
    // Debug logging to see what data we're receiving
    React.useEffect(() => {
        console.log('Rirekisho Component Data:', {
            editable,
            education: data.education,
            work: data.work,
            name: data.name
        });
    }, [data, editable]);
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

    const isExport = !editable; // export/print mode (non-editable)

    // Local draft for languages input so spaces can be entered while editing.
    const [langDraft, setLangDraft] = React.useState<string>((data.languages || []).join("、"));

    React.useEffect(() => {
        setLangDraft((data.languages || []).join("、"));
    }, [data.languages, editable]);

    return (
        <div className={`text-black ${editable ? 'responsive-edit' : 'print-layout'}`}>
            {/* Page 1 */}
            <section className="a4 bg-white px-[8mm] pt-[6mm] pb-[6mm] rirekisho first-page"
                style={isExport ? { position: 'relative' } : undefined}>
                {/* Title and date */}
                <div className="flex items-start justify-between pr-[30mm]">
                    <div className="r-title">履 歴 書</div>
                    <div className="text-[10pt] leading-tight mt-[8mm] mr-[6mm]">
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
                <div className={`${isExport ? 'mt-[3mm]' : 'mt-[4mm]'} relative`} style={{ position: 'relative' }}>
                    {/* Right: Photo - positioned absolutely to page for export */}
                    <div
                        className={`photo-slot ${isExport ? 'absolute right-[8mm] top-[-15mm]' : 'absolute right-[2mm] top-[-19mm]'}`}
                        style={{ zIndex: 5 }}
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
                                <col style={{ width: "28mm" }} />
                            </colgroup>
                            <tbody>
                                {/* Row: Furigana + Gender */}
                                <tr className="r-row-sm r-row-name-furigana">
                                    <th className="cell label">フリガナ</th>
                                    <td className="cell text-center" colSpan={2} style={{ fontSize: '14px' }}>
                                        <EditableCell
                                            field="furigana"
                                            value={data.furigana || ""}
                                            editable={editable}
                                            onChange={onChange}
                                            className="text-center"
                                        />
                                    </td>
                                    <th className="cell label">性別</th>
                                </tr>
                                {/* Row: Name + Gender input */}
                                <tr className="r-row-lg r-row-name">
                                    <th className="cell label">氏　名</th>
                                    <td className="cell" colSpan={2} style={{ fontSize: '14px' }}>
                                        <EditableCell
                                            field="name"
                                            value={data.name || ""}
                                            editable={editable}
                                            onChange={onChange}
                                            className="text-center"
                                        />
                                    </td>
                                    <td className="cell text-center">
                                        <EditableCell
                                            field="gender"
                                            value={data.gender || ""}
                                            editable={editable}
                                            onChange={onChange}
                                            className="text-center"
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
                            <col style={{ width: "15mm" }} />
                            <col style={{ width: "7mm" }} />
                            <col style={{ width: "12mm" }} />
                            <col style={{ width: "10mm" }} />
                            <col style={{ width: "47.8mm" }} />
                            <col style={{ width: "20mm" }} />
                            <col style={{ width: "calc(100% - 123.8mm)" }} />
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
                                        placeholder=""
                                    />
                                </td>
                                <td className="cell text-center text-[9pt]">月</td>
                                <td className="cell" style={{ overflow: 'hidden' }}>
                                    {editable ? (
                                        <div className="flex items-center justify-start gap-[0.5mm] whitespace-nowrap leading-none no-break-ja text-[10pt]">
                                            <div className="w-[14mm] text-center">
                                                <EditableCell
                                                    field="birthDay"
                                                    value={data.birthDay || ""}
                                                    editable={editable}
                                                    onChange={onChange}
                                                    className="inline-cell text-center"
                                                    placeholder=""
                                                />
                                            </div>
                                            <span className="text-[10pt] leading-none">日生（満</span>
                                            <div className="w-[6mm] text-center">
                                                <EditableCell
                                                    field="age"
                                                    value={data.age || ""}
                                                    editable={editable}
                                                    onChange={onChange}
                                                    className="inline-cell text-center"
                                                    placeholder=""
                                                />
                                            </div>
                                            <span className="text-[10pt] leading-none">歳）</span>
                                        </div>
                                    ) : (
                                        <div
                                            className={`no-break-ja text-[10pt] flex items-baseline gap-[0.3mm] ${!editable ? 'justify-center' : ''}`}
                                            style={{ paddingRight: '0.5mm', maxWidth: '100%', overflow: 'hidden' }}
                                        >
                                            <span>{data.birthDay || "\u00A0"}</span>
                                            <span>日生（満</span>
                                            <span>{data.age || "\u00A0"}</span>
                                            <span>歳）</span>
                                        </div>
                                    )}
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
                            <tr className="r-row-sm r-row-address-furigana">
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
                            <tr className="r-row-md r-row-address">
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
                <div className={`${isExport ? 'mt-[3mm]' : 'mt-[6mm]'}`}>
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr>
                                <th className="cell text-center w-[14mm]">年</th>
                                <th className="cell text-center w-[14mm]">月</th>
                                <th className="cell text-center">学　歴 ・ 職　歴（項目別にまとめて記入）</th>
                                {editable && <th className="cell text-center w-[20mm]">操作</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                // Debug: Log all data to console for debugging
                                if (!editable) {
                                    console.log('🔍 DEBUG - Export Data:');
                                    console.log('Education:', data.education);
                                    console.log('Work:', data.work);
                                }

                                // Now we have 12 education entries by default, so just render them all
                                const allEntries: Array<{
                                    type: 'education' | 'work';
                                    index: number;
                                    data: any;
                                }> = [];

                                // Add all 12 education entries - they behave exactly like the first 2 rows
                                (data.education || []).forEach((e, i) => {
                                    console.log(`Education ${i}:`, e);
                                    allEntries.push({
                                        type: 'education',
                                        index: i,
                                        data: e
                                    });
                                });

                                // Add work entries after education  
                                (data.work || []).forEach((w, i) => {
                                    console.log(`Work ${i}:`, w);
                                    allEntries.push({
                                        type: 'work',
                                        index: i,
                                        data: w
                                    });
                                });

                                // Always render all entries (even blank) so newly added rows appear in PDF export too
                                const entriesToRender = allEntries;

                                // Render all entries with unified logic
                                return entriesToRender.map((entry, globalIndex) => {
                                    if (entry.type === 'education') {
                                        const e = entry.data;
                                        // Extract year and month safely
                                        const yearPart = (e.from || "").slice(0, 4).replace(/[^0-9]/g, "");
                                        const monthPart = (e.from || "").slice(5, 7).replace(/[^0-9]/g, "");

                                        return (
                                            <tr key={`edu-${entry.index}`}>
                                                <td className="cell text-center">
                                                    {editable ? (
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            className="cell-input text-center"
                                                            id={`edu-year-${entry.index}`}
                                                            value={(e.from || "").split('-')[0] || ""}
                                                            onChange={(ev) => {
                                                                const y = ev.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                                                                const currentMonth = (e.from || "").split('-')[1] || "";
                                                                updateEducation(entry.index, {
                                                                    from: y || currentMonth ? `${y}-${currentMonth}` : ""
                                                                });
                                                            }}
                                                        />
                                                    ) : (
                                                        // Show any data that exists, even if partially filled
                                                        yearPart || (e.from || "").split('-')[0] || "\u00A0"
                                                    )}
                                                </td>
                                                <td className="cell text-center">
                                                    {editable ? (
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            className="cell-input text-center"
                                                            id={`edu-month-${entry.index}`}
                                                            value={(e.from || "").split('-')[1] || ""}
                                                            onChange={(ev) => {
                                                                const mm = ev.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                                                                const currentYear = (e.from || "").split('-')[0] || "";
                                                                updateEducation(entry.index, {
                                                                    from: currentYear || mm ? `${currentYear}-${mm}` : ""
                                                                });
                                                            }}
                                                        />
                                                    ) : (
                                                        // Show any data that exists, even if partially filled
                                                        monthPart || (e.from || "").split('-')[1] || "\u00A0"
                                                    )}
                                                </td>
                                                {(() => {
                                                    const schoolTextRaw = (e.school || "").trim();
                                                    const normalize = (s: string) => s
                                                        .replace(/\s+/g, "")
                                                        .replace(/[（）]/g, (m) => (m === '（' ? '(' : ')'))
                                                        .replace(/[\.・]/g, "");
                                                    const schoolTextN = normalize(schoolTextRaw);
                                                    const isCentered = schoolTextN.includes("学歴")
                                                        || schoolTextN.includes("職歴");
                                                    const isRight = schoolTextN === "以上";
                                                    const tdStyle: React.CSSProperties = {
                                                        ...(isRight ? { textAlign: 'right' } : (isCentered ? { textAlign: 'center' } : {}))
                                                    };

                                                    return (
                                                        <td className={`${editable ? "cell" : "cell cell-wrap"}`} style={tdStyle}>
                                                            {editable ? (
                                                                <input
                                                                    type="text"
                                                                    className={`cell-input ${isCentered ? "text-center" : ""} ${isRight ? "text-right" : ""}`}
                                                                    value={e.school || ""}
                                                                    onChange={(ev) => updateEducation(entry.index, { school: ev.target.value })}
                                                                />
                                                            ) : (
                                                                e.school !== undefined ? e.school : "\u00A0"
                                                            )}
                                                        </td>
                                                    );
                                                })()}
                                                {editable && (
                                                    <td className="cell text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                type="button"
                                                                className="text-green-600 hover:text-green-800 text-[12pt] font-bold"
                                                                onClick={() => {
                                                                    const newEducation = { from: "", to: "", school: "", note: "" };
                                                                    const updated = [...(data.education || [])];
                                                                    updated.splice(entry.index + 1, 0, newEducation);
                                                                    onChange?.({ education: updated });
                                                                }}
                                                                title="この行の後に追加"
                                                            >
                                                                +
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="text-red-600 hover:text-red-800 text-[12pt]"
                                                                onClick={() => {
                                                                    const updated = (data.education || []).filter((_, i) => i !== entry.index);
                                                                    onChange?.({ education: updated });
                                                                }}
                                                                title="削除"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    } else if (entry.type === 'work') {
                                        const w = entry.data;
                                        // Extract year and month safely
                                        const yearPart = (w.from || "").slice(0, 4).replace(/[^0-9]/g, "");
                                        const monthPart = (w.from || "").slice(5, 7).replace(/[^0-9]/g, "");

                                        return (
                                            <tr key={`work-${entry.index}`}>
                                                <td className="cell text-center">
                                                    {editable ? (
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            className="cell-input text-center"
                                                            id={`work-year-${entry.index}`}
                                                            value={(w.from || "").split('-')[0] || ""}
                                                            onChange={(ev) => {
                                                                const y = ev.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                                                                const currentMonth = (w.from || "").split('-')[1] || "";
                                                                updateWork(entry.index, {
                                                                    from: y || currentMonth ? `${y}-${currentMonth}` : ""
                                                                });
                                                            }}
                                                        />
                                                    ) : (
                                                        // Show any data that exists, even if partially filled
                                                        yearPart || (w.from || "").split('-')[0] || "\u00A0"
                                                    )}
                                                </td>
                                                <td className="cell text-center">
                                                    {editable ? (
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            className="cell-input text-center"
                                                            id={`work-month-${entry.index}`}
                                                            value={(w.from || "").split('-')[1] || ""}
                                                            onChange={(ev) => {
                                                                const mm = ev.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                                                                const currentYear = (w.from || "").split('-')[0] || "";
                                                                updateWork(entry.index, {
                                                                    from: currentYear || mm ? `${currentYear}-${mm}` : ""
                                                                });
                                                            }}
                                                        />
                                                    ) : (
                                                        // Show any data that exists, even if partially filled
                                                        monthPart || (w.from || "").split('-')[1] || "\u00A0"
                                                    )}
                                                </td>
                                                {(() => {
                                                    const companyTextRaw = (w.company || "").trim();
                                                    const normalize = (s: string) => s
                                                        .replace(/\s+/g, "")
                                                        .replace(/[（）]/g, (m) => (m === '（' ? '(' : ')'))
                                                        .replace(/[\.・]/g, "");
                                                    const companyTextN = normalize(companyTextRaw);
                                                    const isCentered = companyTextN.includes("職歴");
                                                    const isRight = companyTextN === "以上";
                                                    const displayText = `${w.company || ""}${w.role ? ` ／ ${w.role}` : ""}`;
                                                    const tdStyle: React.CSSProperties = {
                                                        ...(isRight ? { textAlign: 'right' } : (isCentered ? { textAlign: 'center' } : {}))
                                                    };

                                                    return (
                                                        <td className={`${editable ? "cell" : "cell cell-wrap"}`} style={tdStyle}>
                                                            {editable ? (
                                                                <input
                                                                    type="text"
                                                                    className={`cell-input ${isCentered ? "text-center" : ""} ${isRight ? "text-right" : ""}`}
                                                                    value={displayText}
                                                                    onChange={(ev) => {
                                                                        const value = ev.target.value;
                                                                        const [company, role] = value.split(" ／ ");
                                                                        updateWork(entry.index, { company: company || "", role: role || "" });
                                                                    }}
                                                                />
                                                            ) : (
                                                                w.company !== undefined ? displayText : "\u00A0"
                                                            )}
                                                        </td>
                                                    );
                                                })()}
                                                {editable && (
                                                    <td className="cell text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                type="button"
                                                                className="text-green-600 hover:text-green-800 text-[12pt] font-bold"
                                                                onClick={() => {
                                                                    const newWork = { from: "", to: "", company: "", role: "", note: "" };
                                                                    const updated = [...(data.work || [])];
                                                                    updated.splice(entry.index + 1, 0, newWork);
                                                                    onChange?.({ work: updated });
                                                                }}
                                                                title="この行の後に追加"
                                                            >
                                                                +
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="text-red-600 hover:text-red-800 text-[12pt]"
                                                                onClick={() => {
                                                                    const updated = (data.work || []).filter((_, i) => i !== entry.index);
                                                                    onChange?.({ work: updated });
                                                                }}
                                                                title="削除"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    }
                                });
                            })()}
                        </tbody>
                    </table>

                    {/* Add buttons for education and work entries */}
                    {editable && (
                        <div className="mt-[4mm] flex gap-[4mm]">
                            <button
                                type="button"
                                className="btn btn-primary text-[9pt] px-[4mm] py-[1mm]"
                                onClick={() => {
                                    // Add new education entry to WORK array so it appears in the last row
                                    const work = data.work || [];
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
                                + 学歴追加
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary text-[9pt] px-[4mm] py-[1mm]"
                                onClick={() => {
                                    // Add new work entry at the end so it appears last in table
                                    const work = data.work || [];
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
            </section>

            {/* Page 2 - 履歴書 (続き) */}
            <section className="a4 bg-white px-[8mm] pt-[6mm] pb-[6mm] rirekisho second-page flex flex-col">
                {/* 免許・資格 Section */}
                <div className={`${isExport ? 'mt-[2mm]' : 'mt-[6mm]'}`}>
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr>
                                <th className="cell text-center w-[14mm]">年</th>
                                <th className="cell text-center w-[10mm]">月</th>
                                <th className="cell text-center">免許・資格</th>
                                {editable && <th className="cell text-center w-[20mm]">操作</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const provided = (data.qualifications || []);
                                // Always render all rows (even blank) so they appear in PDF export too
                                const rows = provided;
                                return rows.map((q, i) => (
                                    <tr key={`qual-${i}`}>
                                        <td className="cell text-center">
                                            {editable ? (
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    className="cell-input text-center"
                                                    id={`qual-year-${i}`}
                                                    value={q.year || ""}
                                                    onChange={(ev) => {
                                                        // Allow free numeric input for year (no hard truncation)
                                                        const year = ev.target.value.replace(/[^0-9]/g, "");
                                                        const newQuals = [...(data.qualifications || [])];
                                                        newQuals[i] = { ...newQuals[i], year };
                                                        onChange?.({ qualifications: newQuals });
                                                    }}
                                                />
                                            ) : (
                                                q.year || "\u00A0"
                                            )}
                                        </td>
                                        <td className="cell text-center">
                                            {editable ? (
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    className="cell-input text-center"
                                                    id={`qual-month-${i}`}
                                                    value={q.month || ""}
                                                    onChange={(ev) => {
                                                        // Allow free numeric input for month (no forced 1-12 clamping)
                                                        const raw = ev.target.value.replace(/[^0-9]/g, "");
                                                        const month = raw;
                                                        const newQuals = [...(data.qualifications || [])];
                                                        newQuals[i] = { ...newQuals[i], month };
                                                        onChange?.({ qualifications: newQuals });
                                                    }}
                                                />
                                            ) : (
                                                q.month || "\u00A0"
                                            )}
                                        </td>
                                        <td className="cell">
                                            {editable ? (
                                                <input
                                                    type="text"
                                                    className="cell-input"
                                                    style={getAutoCompactStyle(q.qualification, 30)}
                                                    value={q.qualification || ""}
                                                    onChange={(ev) => {
                                                        const newQuals = [...(data.qualifications || [])];
                                                        newQuals[i] = { ...newQuals[i], qualification: ev.target.value };
                                                        onChange?.({ qualifications: newQuals });
                                                    }}
                                                    placeholder="資格名を入力"
                                                />
                                            ) : (
                                                <div style={getAutoCompactStyle(q.qualification, 30)}>{q.qualification || "\u00A0"}</div>
                                            )}
                                        </td>
                                        {editable && (
                                            <td className="cell text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        className="text-green-600 hover:text-green-800 text-[12pt] font-bold"
                                                        onClick={() => {
                                                            const newQual = { year: "", month: "", qualification: "" };
                                                            const updated = [...(data.qualifications || [])];
                                                            updated.splice(i + 1, 0, newQual);
                                                            onChange?.({ qualifications: updated });
                                                        }}
                                                        title="この行の後に追加"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-red-600 hover:text-red-800 text-[12pt]"
                                                        onClick={() => {
                                                            const updated = (data.qualifications || []).filter((_, idx) => idx !== i);
                                                            onChange?.({ qualifications: updated });
                                                        }}
                                                        title="削除"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ));
                            })()}
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
                <div className={`${isExport ? 'mt-[3mm]' : 'mt-[8mm]'}`}>
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
                                            className="w-full border-none outline-none px-[2mm]"
                                            style={getAutoCompactStyle(langDraft, 50)}
                                            value={langDraft}
                                            onChange={(e) => setLangDraft(e.target.value)}
                                            onBlur={() => {
                                                const arr = langDraft
                                                    .split(/[,、]/)
                                                    .map((s) => s.trim())
                                                    .filter(Boolean);
                                                onChange?.({ languages: arr });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    (e.target as HTMLElement).blur();
                                                }
                                            }}
                                            placeholder=""
                                        />
                                    ) : (
                                        <div className="px-[2mm]" style={getAutoCompactStyle((data.languages || []).join("、"), 50)}>{(data.languages || []).join("、")}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 得意な科目・分野 / アルバイト経験 */}
                <div className={`${isExport ? 'mt-[3mm]' : 'mt-[6mm]'}`}>
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
                                <td className="cell align-top p-[2mm]" style={isExport ? { minHeight: "22mm", borderRightStyle: "dotted" } : { height: "28mm", borderRightStyle: "dotted" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none"
                                            style={getAutoCompactStyle(data.specialty, 100)}
                                            value={data.specialty || ""}
                                            onChange={(e) => onChange?.({ specialty: e.target.value })}
                                        />
                                    ) : (
                                        <div style={getAutoCompactStyle(data.specialty, 100)} className="whitespace-pre-wrap">{data.specialty}</div>
                                    )}
                                </td>
                                <td className="cell align-top p-[2mm]" style={isExport ? { minHeight: "22mm" } : { height: "28mm" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none"
                                            style={getAutoCompactStyle(data.partTimeExperience, 100)}
                                            value={data.partTimeExperience || ""}
                                            onChange={(e) => onChange?.({ partTimeExperience: e.target.value })}
                                        />
                                    ) : (
                                        <div style={getAutoCompactStyle(data.partTimeExperience, 100)} className="whitespace-pre-wrap">{data.partTimeExperience}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 自己PR */}
                <div className={`${isExport ? 'mt-[3mm]' : 'mt-[6mm]'}`}>
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            <tr>
                                <th className="cell label w-[30mm] text-left" style={{ borderBottomStyle: "dotted", textAlign: "left" }}>自己ＰＲ</th>
                            </tr>
                            <tr>
                                <td className="cell p-[2mm]" style={isExport ? { minHeight: "40mm", height: "40mm", borderTop: "0", verticalAlign: "top" } : { height: "52mm", borderTop: "0", verticalAlign: "top" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none"
                                            style={getAutoCompactStyle(data.selfPR, 150)}
                                            value={data.selfPR || ""}
                                            onChange={(e) => onChange?.({ selfPR: e.target.value })}
                                        />
                                    ) : (
                                        <div style={getAutoCompactStyle(data.selfPR, 150)} className="whitespace-pre-wrap">{data.selfPR}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 志望動機 */}
                <div className={`${isExport ? 'mt-[3mm]' : 'mt-[6mm]'}`}>
                    <table className="w-full border-collapse table-fixed">
                        <tbody>
                            <tr>
                                <th className="cell label w-[30mm] text-left" style={{ borderBottomStyle: "dotted", textAlign: "left" }}>志望動機</th>
                            </tr>
                            <tr>
                                <td className="cell p-[2mm]" style={isExport ? { minHeight: "40mm", height: "40mm", borderTop: "0", verticalAlign: "top" } : { height: "58mm", borderTop: "0", verticalAlign: "top" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none"
                                            style={getAutoCompactStyle(data.motivation, 150)}
                                            value={data.motivation || ""}
                                            onChange={(e) => onChange?.({ motivation: e.target.value })}
                                        />
                                    ) : (
                                        <div style={getAutoCompactStyle(data.motivation, 150)} className="whitespace-pre-wrap">{data.motivation}</div>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 通勤時間 / 扶養家族数 / 配偶者の有無 / 配偶者の扶養義務 */}
                <div className={`${isExport ? 'mt-[3mm]' : 'mt-[8mm]'} avoid-break`}>
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
                <div className={`${isExport ? 'mt-[2mm]' : 'mt-[6mm]'} avoid-break flex-1 flex flex-col`}>
                    <table className="w-full border-collapse table-fixed h-full personal-requests-table">
                        <tbody>
                            <tr>
                                <th className="cell label">
                                    本人希望記入欄（特に給与・職種・勤務時間・勤務地・その他についての希望などがあれば記入）
                                </th>
                            </tr>
                            <tr className="h-full">
                                <td className="cell p-[2mm] h-full personal-requests-td" style={isExport ? { minHeight: "12mm", height: "100%" } : { minHeight: "24mm", height: "100%" }}>
                                    {editable ? (
                                        <textarea
                                            className="w-full h-full resize-none border-none outline-none"
                                            style={getAutoCompactStyle(data.personalRequests, 100)}
                                            value={data.personalRequests || ""}
                                            onChange={(e) => onChange?.({ personalRequests: e.target.value })}
                                        />
                                    ) : (
                                        <div style={getAutoCompactStyle(data.personalRequests, 100)} className="whitespace-pre-wrap h-full">{data.personalRequests}</div>
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
