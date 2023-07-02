"use client";

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { Trash } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Size } from "@prisma/client";
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
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';

const formSchema = z.object({
  name: z.string().min(1, { message: "Deve ter 1 ou mais caracteres" }),
  value: z
    .string()
    .min(4)
    .regex(/^#/, { message: "string deve ser um código hexadecimal válido" }),
})

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Size | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [ open, setOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const title = initialData ? "Editar cor" : "Criar cor"; 
  const description = initialData ? "Editar cor" : "Criar novo cor"
  const toastMessage = initialData ? "Cor atualizado." : "Cor criado."
  const action = initialData ? "Salvar mudanças" : "Criar" 

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    }
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
        
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
        
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMessage);

    } catch (error) {
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  // Delete colors confirmation
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Cor deletado.");

    } catch (error) {
      toast.error(
        "Certifique-se de remover todos os produtos do cor primeiro."
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
                      placeholder="Cor nome"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-x-4'>

                    <Input
                      disabled={loading}
                      placeholder="Cor valor"
                      {...field}
                    />
                    <div
                      className='border p-4 rounded-full'
                      style={{ backgroundColor: field.value}}
                    />
                    </div>
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