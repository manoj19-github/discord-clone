"use client";
import { cn } from '@/lib/utils';
import { ServerWithMemberWithProfiles } from '@/types';
import { Member, MemberRole, Profile } from '@prisma/client';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {FC} from 'react'
import UserAvatar from '../ui/UserAvatar';

interface ServerMembersProps{
    member:Member& {profile:Profile};
    server: ServerWithMemberWithProfiles;
}

const roleIconMap = {
    [MemberRole.GUEST]:null,
    [MemberRole.MODERATOR]:<ShieldCheck className="w-4 h-4 ml-2 text-indigo-600"/>,
    [MemberRole.ADMIN]:<ShieldAlert className="w-4 h-4 ml-2 text-rose-600"/>
}

const ServerMembers:FC<ServerMembersProps> = ({member,server}):JSX.Element => {
    const params = useParams();
    const router = useRouter();
    const icon = roleIconMap[member.role];
  return (
    <button className={cn("group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all mb-1",params.memberId === member.id ? `bg-zinc-700/20 dark:bg-zinc-700 `:"")}>
        <UserAvatar src={member.profile.imageUrl} className="w-4 h-4 md:h-8 md:w-8"/>
        <p className={cn(`font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all`,
        params?.memberId === member.id ? "text-primary dark:text-zinc-200 dark:group-hover:text-white":"")}>
            {member.profile.name}
        </p>
        {icon}
    </button>
  )
}

export default ServerMembers