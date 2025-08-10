/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import Rirekisho, { type RirekishoData } from "@/components/Rirekisho";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PrintPage({ params }: Props) {
    const { id } = await params;
    const resume = await prisma.resume.findUnique({ where: { id } });
    if (!resume) return <div className="p-6">Not found</div>;
    const data = (resume.data as any) as RirekishoData;
    return (
        <div className="bg-white p-[0]">
            <Rirekisho data={data} editable={false} />
        </div>
    );
}
