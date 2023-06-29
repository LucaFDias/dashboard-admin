import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    
    const { name } = body;

    if(!userId) {
      return new NextResponse("Não autorizado", {status: 401});
    }

    if(!name) {
      return new NextResponse("O nome é obrigatório", {status: 400});
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId
      }
    });

    return NextResponse.json(store);

  } catch (error) {
    console.log('[STORES_POSTS]', error)

    return new NextResponse("Error iterno", {status: 500});
  }
}