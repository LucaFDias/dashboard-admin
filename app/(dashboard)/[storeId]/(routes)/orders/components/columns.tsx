"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string
  cpf: string
  phone: string
  adress: string
  isPaid: boolean
  products: string
  totalPrice: string
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produtos",
  },
  {
    accessorKey: "cpf",
    header: "Cpf",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "adress",
    header: "Endereço",
  },
  {
    accessorKey: "isPaid",
    header: "Pago",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]