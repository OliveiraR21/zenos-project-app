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
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import type { Project, User } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { collection, doc, query, where, documentId } from 'firebase/firestore';
import { useMemo } from 'react';

interface ProjectCardProps {
  project: Project;
}

function MemberAvatar({ user }: { user: User }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="-ml-2 border-2 border-background bg-background">
          <AvatarImage src={user.avatarUrl} alt={user.displayName} />
          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <p>{user.displayName}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ProjectMemberAvatars({ memberIds }: { memberIds: string[] }) {
  const firestore = useFirestore();

  const membersQuery = useMemoFirebase(() => {
    if (!firestore || !memberIds || memberIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', memberIds));
  }, [firestore, memberIds]);

  const { data: members, isLoading } = useCollection<User>(membersQuery);

  if (isLoading || !members) {
     return (
        <div className="flex items-center">
            {Array.from({ length: Math.min(memberIds.length, 5) }).map((_, i) => (
                 <Avatar key={i} className="-ml-2 border-2 border-background bg-background">
                    <AvatarFallback>?</AvatarFallback>
                 </Avatar>
            ))}
        </div>
     );
  }

  const visibleMembers = members.slice(0, 5);
  const remainingMembersCount = members.length > visibleMembers.length ? memberIds.length - visibleMembers.length : 0;


  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center">
        {visibleMembers.map((member) => (
          <MemberAvatar key={member.id} user={member} />
        ))}
        {remainingMembersCount > 0 && (
           <Avatar className="-ml-2 border-2 border-background bg-background">
             <AvatarFallback>+{remainingMembersCount}</AvatarFallback>
           </Avatar>
        )}
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
      <Card className="flex flex-col hover:border-primary/50 hover:bg-card/80 transition-all h-full group">
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
                <AvatarImage src={owner.avatarUrl} alt={owner.displayName} />
                <AvatarFallback>{owner.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{owner.displayName}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">Membros</span>
            {memberIds.length > 0 && <ProjectMemberAvatars memberIds={memberIds} />}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
