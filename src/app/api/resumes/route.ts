import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ResumeSchema = z.object({
    title: z.string().min(1),
    template: z.string().min(1),
    data: z.any(),
    pageFormat: z.string().default("A4"),
    pageCount: z.number().int().min(1).max(10).default(2),
});

export async function GET() {
    const items = await prisma.resume.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = await req.json();
    const parsed = ResumeSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }
    const created = await prisma.resume.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
}
