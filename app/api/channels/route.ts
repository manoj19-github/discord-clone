import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = await new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) return new NextResponse("Unauthorized", { status: 400 });
    if (!serverId)
      return new NextResponse("Server Id is missing", { status: 400 });
    if (!name || name === "general")
      return new NextResponse("Name is invalid or general", { status: 400 });
    if (
      !type ||
      type.trim() === "" ||
      !["TEXT", "VIDEO", "AUDIO"].includes(type)
    )
      return new NextResponse("Invalid type", { status: 400 });
    const server = await database.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });
    return NextResponse.json(server,{status:200});
  } catch (error) {
    console.log("error occured : ", error);
    return new NextResponse("Internal Error ", { status: 500 });
  }
}
