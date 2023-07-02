"use client";

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { Trash } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Billboard, Category } from "@prisma/client";
import { zodResolver} from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation'; 

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent,
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
  
const formSchema = z.object({
  name: z.string().min(1, { message: "Deve ter 1 ou mais caracteres" }),
  billboardId: z.string().min(1, { message: "Deve ter 1 ou mais caracteres"})
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards
}) => {
  const params = useParams();
  const router = useRouter();

  const [ open, setOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const title = initialData ? "Editar categoria" : "Criar categoria"; 
  const description = initialData ? "Editar categoria" : "Criar nova categoria"
  const toastMessage = initialData ? "Categoria atualizada." : "Categoria criada."
  const action = initialData ? "Salvar mudanças" : "Criar" 

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
     billboardId: '',
    }
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
        
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
        
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);

    } catch (error) {
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  // Delete categories confirmation
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryd}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Categoria deletada.");

    } catch (error) {
      toast.error(
        "Certifique-se de remover todos os produtos da categoria primeiro."
      );

    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome da categoria"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do outdoor</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Selecione um outdoor"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem
                            key={billboard.id}
                            value={billboard.id}
                          >
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}