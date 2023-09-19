import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 400 });
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member Id missing", { status: 400 });
    }

    const server = await database.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error : ", { status: 500 });
    console.log("error occured");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 400 });
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }
    if (!params.memberId) {
      return new NextResponse("Member Id missing", { status: 400 });
    }

    const server = await database.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error : ", { status: 500 });
    console.log("error occured");
  }
}
