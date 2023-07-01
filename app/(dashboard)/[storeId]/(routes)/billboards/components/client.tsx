"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { BillboardColumn, columns } from "./columns";


interface BillboardClientProps {
  data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Outdoors (${data.length})`}
          description="Gerencie outdoors para sua loja"
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus
            className="mr-2 h-4 w-4"
          />
          Adicionar novo
        </Button>
      </div>
      <Separator/>
      <DataTable searchKey="label" columns={columns} data={data}/>
      <Heading title="API" description="API calls for billboards"/>
      <Separator/>
      <ApiList
        entityName="billboards" 
        entityIdName="billboardId"
      />
    </>
  )
}
