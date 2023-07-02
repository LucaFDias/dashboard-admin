import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb"
import { NextResponse } from "next/server"


export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Id da cor obrigatório", { status: 400 })
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    })
    return NextResponse.json(color)
  } catch (error) {
    console.log("[COLOR_GET", error)

    return new NextResponse("Internal error", { status: 500 })
  }
}

// PATCH
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 })
    };

    if (!name) {
      return new NextResponse("Nome obrigatório", { status: 400 })
    };

    if (!value) {
      return new NextResponse("Valor é obrigatório", { status: 400 })
    };


    if (!params.colorId) {
      return new NextResponse("Id da cor é obrigatório", { status: 400 })
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_PATCH", error);

    return new NextResponse("Internal error", { status: 500 });
  };
};

//GET

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    };

    if (!params.colorId) {
      return new NextResponse("Id da cor obrigatório", { status: 400 });
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_DELETE", error);

    return new NextResponse("Internal error", { status: 500 });
  };
};
