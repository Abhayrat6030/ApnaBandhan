
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Film, Image } from 'lucide-react';

const downloadableItems = [
    {
        id: "ORD001-video",
        name: "Premium Cinematic Combo Video",
        type: "Video",
        icon: Film,
        date: "2024-10-25"
    },
    {
        id: "ORD001-card",
        name: "Premium Cinematic Combo Card",
        type: "Image",
        icon: Image,
        date: "2024-10-25"
    },
];

export default function DownloadsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Downloads</CardTitle>
                    <CardDescription>Your completed and delivered files are available here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {downloadableItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-4">
                                    <item.icon className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Delivered on: {item.date}</p>
                                    </div>
                                </div>
                                <Button size="sm">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        ))}
                    </div>
                     {downloadableItems.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You have no files available for download yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
