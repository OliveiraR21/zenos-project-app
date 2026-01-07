'use client';
import { useMemo } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, MessageSquare, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Notification } from '@/lib/types';

// export const metadata: Metadata = {
//   title: "Notificações",
// };

export default function NotificationsPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const notificationsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'notifications');
  }, [firestore, user]);

  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Suas Atualizações</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Carregando notificações...</p>}
          {!isLoading && (!notifications || notifications.length === 0) && (
            <p className="text-muted-foreground">Você não tem nenhuma notificação.</p>
          )}
          {notifications && notifications.length > 0 && (
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {notifications.map((notification, notificationIdx) => (
                  <li key={notification.id}>
                    <div className="relative pb-8">
                      {notificationIdx !== notifications.length - 1 ? (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <div
                            className={cn(
                              'relative px-1',
                              !notification.isRead &&
                                'bg-primary rounded-full animate-pulse'
                            )}
                          >
                            <div className="h-8 w-8 bg-card rounded-full ring-8 ring-card flex items-center justify-center">
                              {notification.message.includes('atribuiu') && (
                                <UserCheck className="h-5 w-5 text-muted-foreground" />
                              )}
                              {notification.message.includes('comentário') && (
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                              )}
                              {notification.message.includes('vencimento') && (
                                <Bell className="h-5 w-5 text-muted-foreground" />
                              )}
                              {notification.message.includes('concluiu') && (
                                <UserCheck className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                          <div className="text-sm text-foreground">
                            <Link
                              href={notification.link || '#'}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {notification.message}
                            </Link>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
