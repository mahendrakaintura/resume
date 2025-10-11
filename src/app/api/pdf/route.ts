/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

// Force Node.js runtime (Puppeteer not supported on edge runtime)
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // still dynamic because we render arbitrary data

async function getBrowser() {
    // Dynamic import so that the module (and its optional Chromium download logic)
    // is only evaluated when this route is actually hit.
    const puppeteer = (await import("puppeteer")).default;
    // Allow using system-installed Chrome if Puppeteer wasn't able to download (network restricted envs)
    const executablePath = process.env.CHROME_PATH || undefined; // user can set CHROME_PATH
    return puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath,
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const title = (body?.title as string) || "履歴書";
        const data = body?.data as any;
        if (!data || typeof data !== "object") {
            return NextResponse.json({ error: "Invalid body: expected { title, data }" }, { status: 400 });
        }

        const browser = await getBrowser();
        try {
            const page = await browser.newPage();
            // Always fetch fresh assets
            await page.setCacheEnabled(false);
            // Ensure @media print rules are applied during PDF generation
            await page.emulateMediaType('print');
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
            // Seed data into localStorage, then go to print/unsaved which reads it and renders Rirekisho
            await page.goto(baseUrl, { waitUntil: "networkidle0" });
            await page.evaluate((payload) => {
                localStorage.setItem("rirekisho:unsaved", JSON.stringify(payload));
            }, data);
            await page.goto(`${baseUrl}/print/unsaved?t=${Date.now()}`, { waitUntil: "networkidle0" });
            // Wait for the React client component to hydrate and load data from localStorage.
            // The PrintUnsavedClient shows a div with class 'print-surface' once data is loaded.
            await page.waitForSelector('.print-surface', { timeout: 5000 }).catch(() => { });

            // Extra guard: ensure name (or some field) exists; if not, force inject directly.
            const hasData = await page.evaluate(() => {
                const root = document.querySelector('.print-surface');
                if (!root) return false;
                return root.textContent?.trim().length ? true : false;
            });
            if (!hasData) {
                // Fallback: directly inject HTML? Simpler: reload data script.
                await page.evaluate(() => {
                    const raw = localStorage.getItem('rirekisho:unsaved');
                    if (!raw) return;
                    // Trigger a manual React reload by dispatching a storage event
                    window.dispatchEvent(new StorageEvent('storage', { key: 'rirekisho:unsaved', newValue: raw }));
                });
                // Small delay to allow React to re-render after storage event
                await new Promise((res) => setTimeout(res, 300));
            }

            // Wait for all styles and images to fully load
            await page.waitForSelector('.photo-slot', { timeout: 3000 }).catch(() => { });

            // Additional wait for layout stabilization
            await new Promise((res) => setTimeout(res, 1000));

            // Force layout recalculation
            await page.evaluate(() => {
                // Force a reflow to ensure all styles are applied
                document.body.offsetHeight;
                // Scroll to top to ensure proper rendering
                window.scrollTo(0, 0);
            });

            const pdf = await page.pdf({
                format: "A4",
                printBackground: true,
                preferCSSPageSize: false,
                displayHeaderFooter: false,
                margin: {
                    top: '12mm',
                    bottom: '12mm',
                    left: '12mm',
                    right: '12mm'
                },
                // Larger scale for better readability
                scale: 1.0,
                width: '210mm',
                height: '297mm'
            });
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
                    // Prevent viewer/browser caching so style changes are always visible
                    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                    "Pragma": "no-cache",
                    "Expires": "0",
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
