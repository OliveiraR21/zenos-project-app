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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Project, User } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const firestore = useFirestore();

  const userQueryIds = useMemo(() => {
    const ids = [...(project.memberIds || [])];
    if (project.ownerId) {
      ids.push(project.ownerId);
    }
    // Firestore 'in' queries are limited to 30 elements.
    if (ids.length === 0) return null;
    return ids.slice(0, 30)
  }, [project.memberIds, project.ownerId]);
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !userQueryIds) return null;
    return query(collection(firestore, 'users'), where('id', 'in', userQueryIds));
  }, [firestore, userQueryIds?.join(',')]);

  const { data: users } = useCollection<User>(usersQuery);

  const projectMembers = useMemo(() => {
    return users?.filter((user) => project.memberIds?.includes(user.id)) || [];
  }, [users, project.memberIds]);
  
  const owner = useMemo(() => {
    return users?.find((user) => user.id === project.ownerId);
  }, [users, project.ownerId]);


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
            <div className="flex -space-x-2">
              <TooltipProvider>
                {projectMembers.map((member) => (
                  <Tooltip key={member.id}>
                    <TooltipTrigger asChild>
                      <Avatar className="border-2 border-card">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{member.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
