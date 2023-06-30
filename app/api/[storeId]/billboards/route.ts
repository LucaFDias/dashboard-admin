import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params} : { params: { storeId: string}}
  
  ) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 });
    }

    if (!label) {
      return new NextResponse("O label é obrigatório", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("A Imagem Url é obrigatório", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Id da loja é obrigatório", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId) {
      return new NextResponse("Usuário não autorizado.", { status: 404 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error)

    return new NextResponse("Error iterno", { status: 500 })
  };
};


export async function GET(
  req: Request,
  { params} : { params: { storeId: string}}
  
  ) {
  try {

    if (!params.storeId) {
      return new NextResponse("Id da loja é obrigatório", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId
      }
    });

    return NextResponse.json(billboards)
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error)

    return new NextResponse("Error iterno", { status: 500 })
  };
};