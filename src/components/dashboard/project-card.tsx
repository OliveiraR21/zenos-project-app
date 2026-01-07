'use client';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Project, User } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { doc } from 'firebase/firestore';
import { useMemo } from 'react';

interface ProjectCardProps {
  project: Project;
}

function MemberAvatar({ userId }: { userId: string }) {
  const firestore = useFirestore();
  const userRef = useMemoFirebase(
    () => (firestore && userId ? doc(firestore, 'users', userId) : null),
    [firestore, userId]
  );
  const { data: user } = useDoc<User>(userRef);

  if (!user) {
    return null; // ou um esqueleto/placeholder
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="border-2 border-card">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <p>{user.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ProjectMemberAvatars({ memberIds }: { memberIds: string[] }) {
  // Limita a exibição a um número razoável de avatares para não sobrecarregar a UI
  const visibleMembers = memberIds.slice(0, 5);

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {visibleMembers.map((id) => (
          <MemberAvatar key={id} userId={id} />
        ))}
      </div>
    </TooltipProvider>
  );
}


export function ProjectCard({ project }: ProjectCardProps) {
  const firestore = useFirestore();

  const ownerRef = useMemoFirebase(
    () => (firestore && project.ownerId ? doc(firestore, 'users', project.ownerId) : null),
    [firestore, project.ownerId]
  );
  
  const { data: owner } = useDoc<User>(ownerRef);

  const memberIds = useMemo(() => {
    return project.memberIds || [];
  }, [project.memberIds]);


  return (
    <Link
      href={`/project/${project.id}/board`}
      className="block hover:no-underline"
    >
      <Card className="flex flex-col hover:border-primary/50 hover:bg-card/80 transition-all h-full">
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 h-10">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {owner && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium">Dono:</span>
              <Avatar className="size-6">
                <AvatarImage src={owner.avatarUrl} alt={owner.name} />
                <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{owner.name}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">Membros</span>
            <ProjectMemberAvatars memberIds={memberIds} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
