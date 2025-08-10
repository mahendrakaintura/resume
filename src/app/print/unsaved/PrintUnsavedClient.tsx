"use client";
import React from "react";
import Rirekisho, { type RirekishoData } from "@/components/Rirekisho";

export default function PrintUnsavedClient() {
    const [data, setData] = React.useState<RirekishoData | null>(null);

    React.useEffect(() => {
        try {
            const raw = window.localStorage.getItem("rirekisho:unsaved");
            if (raw) setData(JSON.parse(raw));
        } catch { }
    }, []);

    if (!data) {
        return <div className="a4 rirekisho" style={{ padding: "8mm" }}>Loading…</div>;
    }
    return (
        <div className="print-surface">
            <Rirekisho data={data} editable={false} />
        </div>
    );
}
