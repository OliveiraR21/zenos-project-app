import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MessageSquare, UserCheck } from "lucide-react";
import { notifications } from "@/lib/placeholder-data";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Your Updates</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {notifications.map((notification, notificationIdx) => (
                    <li key={notification.id}>
                        <div className="relative pb-8">
                        {notificationIdx !== notifications.length - 1 ? (
                            <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex items-start space-x-3">
                            <div>
                                <div className={cn(
                                    "relative px-1",
                                    !notification.isRead && "bg-primary rounded-full animate-pulse"
                                )}>
                                    <div className="h-8 w-8 bg-card rounded-full ring-8 ring-card flex items-center justify-center">
                                        {notification.message.includes('assigned') && <UserCheck className="h-5 w-5 text-muted-foreground" />}
                                        {notification.message.includes('comment') && <MessageSquare className="h-5 w-5 text-muted-foreground" />}
                                        {notification.message.includes('due') && <Bell className="h-5 w-5 text-muted-foreground" />}
                                        {notification.message.includes('completed') && <UserCheck className="h-5 w-5 text-muted-foreground" />}
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 py-1.5">
                                <div className="text-sm text-foreground">
                                    <Link href={notification.link} className="font-medium hover:text-primary transition-colors">
                                        {notification.message}
                                    </Link>
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
