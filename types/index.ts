import {Server as NetServer,Socket} from "net"
import { NextApiRequest, NextApiResponse } from "next"
import {Server as SocketIOServer} from "socket.io"
import { Server,Member,Profile } from "@prisma/client"
import { NextResponse } from 'next/server';

export type ServerWithMemberWithProfiles = Server & {
    members:(Member & {profile:Profile})[]
}


export type NextApiResponseServerIO = NextApiResponse & {
    socket:Socket & {
        server:NetServer &{
            io:SocketIOServer;
        }
    }
}