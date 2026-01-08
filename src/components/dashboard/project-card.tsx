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

interface ProjectCardProps {
  project: Project;
}

function MemberAvatar({ user }: { user: User }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="-ml-2 border-2 border-background bg-background">
          <AvatarImage src={user.photoURL} alt={user.displayName} />
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
    // Ensure we have a valid array with at least one ID before creating a query
    if (!firestore || !memberIds || memberIds.length === 0) return null;
    return query(collection(firestore, 'users'), where(documentId(), 'in', memberIds));
  }, [firestore, memberIds]);

  const { data: members, isLoading } = useCollection<User>(membersQuery);

  if (isLoading) {
     return (
        <div className="flex items-center">
            {/* Show skeleton placeholders based on the expected number of members */}
            {Array.from({ length: Math.min(memberIds.length, 5) }).map((_, i) => (
                 <Avatar key={i} className="-ml-2 border-2 border-background bg-muted animate-pulse">
                    <AvatarFallback></AvatarFallback>
                 </Avatar>
            ))}
        </div>
     );
  }
  
  if (!members) {
    return null; // Don't render anything if there are no members
  }

  const visibleMembers = members.slice(0, 5);
  const remainingMembersCount = members.length > 5 ? members.length - 5 : 0;

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
  
  const { data: owner, isLoading: isOwnerLoading } = useDoc<User>(ownerRef);

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
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium">Dono:</span>
             {isOwnerLoading && (
                <div className='flex items-center gap-2'>
                    <div className="size-6 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
            )}
            {!isOwnerLoading && owner && (
              <>
                <Avatar className="size-6">
                  <AvatarImage src={owner.photoURL} alt={owner.displayName} />
                  <AvatarFallback>{owner.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{owner.displayName}</span>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">Membros</span>
            {project.memberIds && project.memberIds.length > 0 && <ProjectMemberAvatars memberIds={project.memberIds} />}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
