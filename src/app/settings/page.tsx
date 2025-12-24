import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users } from "@/lib/placeholder-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações",
};

const currentUser = users[0];

export default function SettingsPage() {
  return (
    <AppLayout>
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">Gerencie sua conta e preferências.</p>
        </div>
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-2">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil</CardTitle>
                        <CardDescription>
                            É assim que os outros verão você no site.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input id="name" defaultValue={currentUser.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={currentUser.email} disabled/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Salvar alterações</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="notifications">
                 <Card>
                    <CardHeader>
                        <CardTitle>Notificações</CardTitle>
                        <CardDescription>
                            Configure como você recebe notificações.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Configurações de notificação em breve.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </AppLayout>
  );
}
