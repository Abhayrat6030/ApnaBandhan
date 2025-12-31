
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, CheckCircle, Gift } from 'lucide-react';

const notifications = [
    {
        id: 1,
        icon: CheckCircle,
        title: "Order ORD001 Delivered!",
        description: "Your 'Premium Cinematic Combo' order has been successfully delivered. Check your downloads!",
        date: "2 days ago",
        read: false,
    },
    {
        id: 2,
        icon: Gift,
        title: "You've earned a reward!",
        description: "You received a 10% discount coupon for your next order. Check 'My Rewards'.",
        date: "3 days ago",
        read: false,
    },
    {
        id: 3,
        icon: Bell,
        title: "New Service Added",
        description: "Check out our new 'Photo Booth GIF' service for your events.",
        date: "1 week ago",
        read: true,
    },
    {
        id: 4,
        icon: CheckCircle,
        title: "Order ORD003 In Progress",
        description: "We have started working on your 'Classic Wedding Album' design.",
        date: "2 weeks ago",
        read: true,
    },
]

export default function NotificationsPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Notifications</CardTitle>
                    <CardDescription>Stay updated with your orders and special offers.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                       {notifications.map(notification => (
                           <div key={notification.id} className={`flex items-start gap-4 p-4 rounded-lg ${!notification.read ? 'bg-secondary/50' : 'bg-transparent'}`}>
                               <div className={`mt-1 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                                   <notification.icon className="h-5 w-5" />
                               </div>
                               <div className="flex-1">
                                   <p className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</p>
                                   <p className="text-sm text-muted-foreground">{notification.description}</p>
                                   <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                               </div>
                                {!notification.read && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                           </div>
                       ))}
                   </div>
                   {notifications.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You have no new notifications.</p>
                        </div>
                   )}
                </CardContent>
            </Card>
        </div>
    )
}
