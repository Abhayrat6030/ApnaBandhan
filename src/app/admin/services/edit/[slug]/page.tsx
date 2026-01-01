
import { getServiceOrPackage } from "@/app/actions/admin";
import EditServicePageClient from "./EditServicePageClient";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

async function EditForm({ slug }: { slug: string }) {
    const item = await getServiceOrPackage(slug);

    if (!item) {
        notFound();
    }

    return <EditServicePageClient item={item} />;
}

function EditFormSkeleton() {
     return <div className="p-4 md:p-8"><Card className="max-w-3xl mx-auto"><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-10 w-full" /></div></CardContent></Card></div>
}

export default function EditServicePage({ params }: { params: { slug: string }}) {
    return (
        <Suspense fallback={<EditFormSkeleton />}>
            <EditForm slug={params.slug} />
        </Suspense>
    )
}
