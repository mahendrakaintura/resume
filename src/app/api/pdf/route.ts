/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const title = (body?.title as string) || "履歴書";
        const data = body?.data as any;
        if (!data || typeof data !== "object") {
            return NextResponse.json({ error: "Invalid body: expected { title, data }" }, { status: 400 });
        }

        const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"], headless: true });
        try {
            const page = await browser.newPage();
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
            // Seed data into localStorage, then go to print/unsaved which reads it and renders Rirekisho
            await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
            await page.evaluate((payload) => {
                localStorage.setItem("rirekisho:unsaved", JSON.stringify(payload));
            }, data);
            await page.goto(`${baseUrl}/print/unsaved`, { waitUntil: "networkidle0" });
            const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
            await page.close();
            const buildDisposition = (name: string) => {
                const fallback = (name || "resume").replace(/[^\x20-\x7E]/g, "_");
                const encoded = encodeURIComponent(`${name}.pdf`);
                return `inline; filename="${fallback}.pdf"; filename*=UTF-8''${encoded}`;
            };
            return new NextResponse(Buffer.from(pdf), {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": buildDisposition(title),
                },
            });
        } finally {
            await browser.close();
        }
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to render PDF" }, { status: 500 });
    }
}

// legacy template removed; quick export now uses the same print route as saved export
