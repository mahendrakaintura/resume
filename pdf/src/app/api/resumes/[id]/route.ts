/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, context: any) {
    const { id } = (await context.params) ?? context.params ?? {};
    const item = await prisma.resume.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
}

export async function PUT(req: Request, context: any) {
    const { id } = (await context.params) ?? context.params ?? {};
    const body = await req.json();
    const item = await prisma.resume.update({ where: { id }, data: body });
    return NextResponse.json(item);
}

export async function DELETE(_: Request, context: any) {
    const { id } = (await context.params) ?? context.params ?? {};
    await prisma.resume.delete({ where: { id } });
    return NextResponse.json({ ok: true });
}
