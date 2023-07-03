import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"


export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Id do outdoor obrigatório", { status: 400 })
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    })
    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_GET", error)

    return new NextResponse("Internal error", { status: 500 })
  }
}

// PATCH

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 })
    };

    if (!label) {
      return new NextResponse("Label obrigatório", { status: 400 })
    };

    if (!imageUrl) {
      return new NextResponse("Url da imagem é obrigatório", { status: 400 })
    };


    if (!params.billboardId) {
      return new NextResponse("Id do outdoor é obrigatório", { status: 400 })
    };

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Usuário não autorizado.", { status: 403 })
    };

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH", error);

    return new NextResponse("Internal error", { status: 500 });
  };
};

//GET

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    };

    if (!params.billboardId) {
      return new NextResponse("Id do outdoor obrigatório", { status: 400 });
    };

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Usuário não autorizado.", { status: 404 });
    };

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE", error);

    return new NextResponse("Internal error", { status: 500 });
  };
};
