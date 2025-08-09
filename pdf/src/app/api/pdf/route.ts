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

        const html = templateHtml(title, data);

        const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"], headless: true });
        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });
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

function templateHtml(title: string, data: any) {
    const esc = (s: any) => (s ?? "").toString();
    const edu = (data.education || [])
        .map((e: any) => `<tr><td>${esc(e.from)} - ${esc(e.to || "")}</td><td>${esc(e.school)}</td><td>${esc(e.note || "")}</td></tr>`)
        .join("");
    const work = (data.work || [])
        .map((w: any) => `<tr><td>${esc(w.from)} - ${esc(w.to || "")}</td><td>${esc(w.company)}</td><td>${esc(w.role || "")}</td><td>${esc(w.note || "")}</td></tr>`)
        .join("");
    const skills = (data.skills || []).map((s: string) => `<span class="chip">${esc(s)}</span>`).join("");
    const languages = (data.languages || []).join("、");
    const spouse = esc(data.spouse || "");
    const spouseDep = esc(data.spouseDependent || "");
    /* 30x40mm at 96DPI ≈ 113x151 px */
    const photoW = 113, photoH = 151;
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
            .box { border:1px solid #000; min-height: 60px; padding:4px; white-space:pre-wrap; }
    </style></head>
    <body>
      <section class="a4">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div><div style="font-size:20px;font-weight:700;">履歴書</div><div style="font-size:10px;color:#666;">Rirekisho</div></div>
          ${photo}
        </div>
        <div class="row"><div>氏名 / Name</div><div style="border:1px solid #000;min-height:20px;">${esc(data.name)}</div></div>
        <div class="row"><div>フリガナ</div><div style="border:1px solid #000;min-height:20px;">${esc(data.furigana || "")}</div></div>
                <div class="row"><div>生年月日</div><div style="border:1px solid #000;min-height:20px;">${[data.birthYear, data.birthMonth, data.birthDay].filter(Boolean).join("-")}</div></div>
        <div class="row"><div>性別</div><div style="border:1px solid #000;min-height:20px;">${esc(data.gender || "")}</div></div>
        <div class="row"><div>住所</div><div style="border:1px solid #000;min-height:20px;white-space:pre-wrap;">${esc(data.address || "")}</div></div>
        <div class="row"><div>電話</div><div style="border:1px solid #000;min-height:20px;">${esc(data.phone || "")}</div></div>
        <div class="row"><div>メール</div><div style="border:1px solid #000;min-height:20px;">${esc(data.email || "")}</div></div>
                <div class="row"><div>対応言語</div><div style="border:1px solid #000;min-height:20px;">${esc(languages)}</div></div>
        <h3>学歴</h3>
        <table><tbody>${edu}</tbody></table>
        <div class="page-break"></div>
      </section>
      <section class="a4">
        <h3>職歴</h3>
        <table><tbody>${work}</tbody></table>
        <h3>スキル</h3>
        <div>${skills}</div>
                <h3>得意な科目・分野 / アルバイト経験</h3>
                <table>
                    <thead><tr><th>得意な科目・分野</th><th>アルバイト経験</th></tr></thead>
                    <tbody><tr><td style="vertical-align:top;white-space:pre-wrap;">${esc(data.specialty || "")}</td><td style="vertical-align:top;white-space:pre-wrap;">${esc(data.partTimeExperience || "")}</td></tr></tbody>
                </table>
                <h3>自己PR</h3>
                <div class="box">${esc(data.selfPR || data.notes || "")}</div>
                <h3>志望動機</h3>
                <div class="box">${esc(data.motivation || "")}</div>
                <h3>通勤・家族</h3>
                <table>
                    <thead><tr><th>通勤時間</th><th>扶養家族数（配偶者を除く）</th><th>配偶者の有無</th><th>配偶者の扶養義務</th></tr></thead>
                    <tbody>
                        <tr>
                            <td style="text-align:center;">約 ${esc(data.commuteMinutes || "")} 分</td>
                            <td style="text-align:center;">${esc(data.dependents || "")} 人</td>
                            <td style="text-align:center;">${spouse ? (spouse === '有' ? '◯ 有 ／ ○ 無' : '○ 有 ／ ◯ 無') : ''}</td>
                            <td style="text-align:center;">${spouseDep ? (spouseDep === '有' ? '◯ 有 ／ ○ 無' : '○ 有 ／ ◯ 無') : ''}</td>
                        </tr>
                    </tbody>
                </table>
                <h3>本人希望記入欄</h3>
                <div class="box">${esc(data.personalRequests || "")}</div>
      </section>
    </body></html>`;
}
