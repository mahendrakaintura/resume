/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: any) {
    const { id } = (await context.params) ?? context.params ?? {};
    if (!id) return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    const resume = await prisma.resume.findUnique({ where: { id } });
    if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const html = templateHtml(resume.title, resume.data as any);

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
    });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
        await page.close();
        return new NextResponse(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="${resume.title}.pdf"`,
            },
        });
    } finally {
        await browser.close();
    }
}

function templateHtml(title: string, data: any) {
    const esc = (s: any) => (s ?? "").toString();
    const edu = (data.education || [])
        .map((e: any) => `<tr><td>${esc(e.from)} - ${esc(e.to || "")}</td><td>${esc(e.school)}</td><td>${esc(e.note || "")}</td></tr>`)
        .join("");
    const work = (data.work || [])
        .map((w: any) => `<tr><td>${esc(w.from)} - ${esc(w.to || "")}</td><td>${esc(w.company)}</td><td>${esc(w.role || "")}</td><td>${esc(w.note || "")}</td></tr>`)
        .join("");
    const skills = (data.skills || []).map((s: string) => `<span class="chip">${esc(s)}</span>`).join("");
    const photoW = 113, photoH = 151; /* 30x40mm at 96dpi */
    const photo = data.photoUrl
        ? `<img src="${esc(data.photoUrl)}" style="width:${photoW}px;height:${photoH}px;object-fit:cover;border:1px solid #000;"/>`
        : `<div style="width:${photoW}px;height:${photoH}px;border:1px solid #999;display:grid;place-items:center;color:#999;">Photo</div>`;
    return `<!doctype html>
  <html lang="ja"><head>
    <meta charset="utf-8" />
    <title>${esc(title)}</title>
    <style>
      @page { size: A4; margin: 12mm; }
      body { font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,"Hiragino Kaku Gothic ProN","Noto Sans JP","Yu Gothic",Meiryo,sans-serif; font-size:12px; color:#000; }
      .a4 { width: 210mm; min-height: 297mm; box-sizing: border-box; }
      .row { display:grid; grid-template-columns: 120px 1fr; gap:8px; margin:6px 0; }
      table { border-collapse: collapse; width:100%; }
      td, th { border:1px solid #000; padding:4px; }
      .page-break { page-break-after: always; }
      .chip { border:1px solid #000; padding:2px 6px; margin:2px; display:inline-block; }
    </style></head>
    <body>
      <section class="a4">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div><div style="font-size:20px;font-weight:700;">履歴書</div><div style="font-size:10px;color:#666;">Rirekisho</div></div>
          ${photo}
        </div>
        <div class="row"><div>氏名 / Name</div><div style="border:1px solid #000;min-height:20px;">${esc(data.name)}</div></div>
        <div class="row"><div>フリガナ</div><div style="border:1px solid #000;min-height:20px;">${esc(data.furigana || "")}</div></div>
        <div class="row"><div>生年月日</div><div style="border:1px solid #000;min-height:20px;">${esc(data.birthDate || "")}</div></div>
        <div class="row"><div>性別</div><div style="border:1px solid #000;min-height:20px;">${esc(data.gender || "")}</div></div>
        <div class="row"><div>住所</div><div style="border:1px solid #000;min-height:20px;white-space:pre-wrap;">${esc(data.address || "")}</div></div>
        <div class="row"><div>電話</div><div style="border:1px solid #000;min-height:20px;">${esc(data.phone || "")}</div></div>
        <div class="row"><div>メール</div><div style="border:1px solid #000;min-height:20px;">${esc(data.email || "")}</div></div>
        <h3>学歴</h3>
        <table><tbody>${edu}</tbody></table>
        <div class="page-break"></div>
      </section>
      <section class="a4">
        <h3>職歴</h3>
        <table><tbody>${work}</tbody></table>
        <h3>スキル</h3>
        <div>${skills}</div>
        <h3>自己PR</h3>
        <div style="border:1px solid #000;min-height:60px;white-space:pre-wrap;padding:4px;">${esc(data.notes || "")}</div>
      </section>
    </body></html>`;
}
