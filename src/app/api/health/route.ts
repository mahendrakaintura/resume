import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // simple DB connectivity check
        await prisma.$queryRaw`SELECT 1`;
        return NextResponse.json({ ok: true, db: true });
    } catch (err) {
        console.error("Health check DB error:", err);
        return NextResponse.json(
            { ok: true, db: false, error: (err as any)?.message ?? String(err) },
            { status: 503 }
        );
    }
}
