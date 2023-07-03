"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { OrderColumn, columns } from "./columns";


interface OrderClientProps {
  data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Ordens (${data.length})`}
          description="Gerencie ordens para sua loja"
        />
      </div>
      <Separator/>
      <DataTable searchKey="products" columns={columns} data={data}/>
    </>
  )
}
