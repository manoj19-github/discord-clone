import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    const server = await database.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });
    return NextResponse.json(server,{status:200});
  } catch (error: any) {
    console.log("servers post : ", error);
    return new NextResponse("interna error", { status: 500 });
  }
}
