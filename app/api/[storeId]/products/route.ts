import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params}: { params: { storeId: string}}
  
  ) {
  try {
    const { userId } = auth()
    const body = await req.json()

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 401 })
    }

    if (!name) {
      return new NextResponse("O label é obrigatório", { status: 400 })
    }

    if (!price) {
      return new NextResponse("O preço é obrigatório", { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse("Id da categoria é obrigatório", { status: 400 })
    }

    if (!colorId) {
      return new NextResponse("Id da cor é obrigatório", { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse("Id do tamanho é obrigatório", { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse("Imagem é obrigatório", { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse("Id da loja é obrigatório", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse("Usuário não autorizado.", { status: 403 })
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: {url: string}) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCTS_POST]", error)

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
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");


    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      }, 
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products)
  } catch (error) {
    console.log("[PRODUCT_GET]", error)

    return new NextResponse("Error iterno", { status: 500 })
  };
};