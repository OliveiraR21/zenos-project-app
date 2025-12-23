import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Blocks, CheckCircle, ListTodo } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <Blocks className="h-8 w-8 text-primary" />,
    title: 'Quadros Kanban Visuais',
    description: 'Arraste e solte tarefas em seu fluxo de trabalho. Veja o progresso rapidamente.',
  },
  {
    icon: <ListTodo className="h-8 w-8 text-primary" />,
    title: 'Visualização de Lista Poderosa',
    description: 'Uma visualização detalhada de suas tarefas em estilo de tabela. Ordene, filtre e edite em linha.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Colaboração em Tempo Real',
    description: 'Trabalhe com sua equipe em tempo real. Veja quem está online e o que estão fazendo.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-landing');
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-xl text-foreground">Zenos</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Comece Agora <ArrowRight className="ml-2" /></Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-foreground">
            Gerenciamento de Projetos, <span className="text-primary">Aperfeiçoado</span>.
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
            Colabore, gerencie projetos e alcance novos picos de produtividade. Dos arranha-céus ao escritório em casa, a maneira como sua equipe trabalha é única—realize tudo com o Zenos.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              Comece de Graça
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
           {heroImage && (
            <div className="relative aspect-video max-w-5xl mx-auto rounded-xl overflow-hidden border shadow-2xl shadow-primary/10">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
            </div>
           )}
        </section>

        <section className="bg-card py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Tudo que você precisa para fazer o trabalho avançar</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Zenos é uma plataforma flexível e completa que ajuda você a gerenciar projetos, organizar tarefas e colaborar com sua equipe.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-background/50 border-border/50 hover:border-primary/50 hover:bg-background transition-all transform hover:-translate-y-1">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Zenos Project. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
