import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-4">
      <title>Google</title>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.62-4.55 1.62-3.87 0-7-3.13-7-7s3.13-7 7-7c1.93 0 3.23.77 4.28 1.78l2.7-2.7C17.64 3.74 15.34 2.5 12.48 2.5c-5.48 0-9.98 4.5-9.98 9.98s4.5 9.98 9.98 9.98c5.68 0 9.54-4.08 9.54-9.54 0-.63-.07-1.25-.16-1.84z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-4">
      <title>Microsoft</title>
      <path
        fill="currentColor"
        d="M11.4 22.2V12.6H1.8V22.2H11.4ZM22.2 22.2V12.6H12.6V22.2H22.2ZM11.4 11.4V1.8H1.8V11.4H11.4ZM22.2 11.4V1.8H12.6V11.4H22.2Z"
      />
    </svg>
  )
}

function AppleIcon() {
    return (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-5">
        <title>Apple</title>
        <path
            fill="currentColor"
            d="M12.032 6.55c.21.213.344.486.41.791.065.304.062.62.012.931-.05.312-.153.605-.306.875-.154.27-.354.505-.596.697-.243.192-.524.335-.836.425-.312.09-.648.125-.99.102-.21-.013-.418-.053-.62-.122-.204-.068-.401-.165-.589-.289-.187-.124-.363-.274-.523-.448-.16-.174-.298-.37-.414-.585-.116-.214-.207-.446-.27-.691-.064-.244-.1-.5-.104-.757.003-.31.054-.61.15-.89.097-.28.238-.535.42-.76.24-.298.542-.51.884-.63.342-.12.71-.143 1.076-.068.22.046.432.128.628.242.196.114.373.26.527.434.137.158.25.334.333.522.085.188.138.388.158.592.016.142.016.283.003.424h-3.477c.045-.23.13-.447.252-.647.123-.2.278-.377.46-.52.184-.143.39-.25.613-.314.223-.063.457-.08.688-.052l.09.01zm4.493-2.92c.62-.756 1.05-1.748 1.135-2.812-1.04.05-2.12.446-2.95 1.127-.58.495-.99,1.16-1.284,1.88-.11.272-.18.55-.224.83-.044.28-.056.563-.043.848.887.05 1.762-.22 2.49-.78.727-.56 1.186-1.42 1.34-2.38-.003.013-.005.026-.007.04-.035.157-.08.31-.14.456-.058.146-.13.284-.214.413-.218.33-.5.605-.83.812-.33.208-.7.34-1.1.39-.4.05-.8.02-1.18-.08s-.75-.28-1.08-.5l-.03-.02c.7-.79 1.08-1.84 1.08-2.95.002-.3-.024-.6-.076-.89-.053-.29-.134-.57-.24-.83-.108-.26-.24-.5-.4-.71-.158-.21-.34-.4-.54-.54-.675-.48-1.5-.74-2.37-.74-.9,0-1.76.27-2.52.8-1.11.78-1.83,2-1.83,3.35,0,.7.15,1.38.44,2.02.29.64.72,1.22,1.28,1.72s1.2.9,1.9.9c.2,0,.4,0,.6-.05.4-.1.75-.3,1.05-.6.3-.3.5-.65.6-.95.1-.3.15-.6.15-.9,0-.11.002-.22-.005-.33-.007-.11-.02-.22-.04-.33-.02-.11-.05-.21-.08-.31-.03-.1-.07-.2-.12-.29-.05-.09-.1-.18-.17-.26-.14-.16-.3-.3-.48-.4-.18-.1-.38-.16-.58-.17-.2-.01-.4,0-.6.06-.2.06-.38.16-.55.3-.17.14-.3.3-.4.48-.1.18-.17.38-.2.58-.03.2-.04.4-.02.6.02.2.06.4.13.58.07.18.16.35.28.5.12.15.26.28.42.38.16.1.34.18.52.23.18.05.38.08.57.08.7,0,1.36-.2,1.96-.58.3-.19.56-.42.78-.68.22-.26.4-.55.54-.86.14-.31.23-.64.28-.97.05-.33.05-.66.02-.98h.02c.017.31.004.62-.04.925-.045.305-.124.6-.234.88-.11.28-.25.54-.415.78-.165.24-.355.45-.565.63-.46.39-1.01.67-1.6.82-.59.15-1.2.16-1.78.03-.58-.13-1.12-.4-1.57-.78-.45-.38-.8-.85-1.03-1.38-.23-.53-.35-1.1-.35-1.7,0-.95.34-1.85.98-2.6.64-.75,1.52-1.2,2.52-1.2.55,0,1.08.14,1.55.4.47.26.85.6,1.15,1,.2.26.35.56.44.88.09.32.13.66.12.99z"/>
      </svg>
    )
}


export default function LoginPage() {
  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Bem-vindo de volta! Por favor, insira seus dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center space-x-2">
            <Button variant="outline" size="icon">
              <GoogleIcon />
              <span className="sr-only">Entrar com Google</span>
            </Button>
            <Button variant="outline" size="icon">
              <MicrosoftIcon />
              <span className="sr-only">Entrar com Microsoft</span>
            </Button>
            <Button variant="outline" size="icon">
              <AppleIcon />
              <span className="sr-only">Entrar com Apple</span>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemplo.com" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" asChild>
            <Link href="/dashboard">Entrar</Link>
          </Button>
          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/signup" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
