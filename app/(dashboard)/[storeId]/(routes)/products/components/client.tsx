"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { ProductColumn, columns } from "./columns";


interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Produtos (${data.length})`}
          description="Gerencie os produtos para sua loja"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus
            className="mr-2 h-4 w-4"
          />
          Adicionar novo
        </Button>
      </div>
      <Separator/>
      <DataTable searchKey="label" columns={columns} data={data}/>
      <Heading title="API" description="API calls for products"/>
      <Separator/>
      <ApiList
        entityName="products" 
        entityIdName="productId"
      />
    </>
  )
}
