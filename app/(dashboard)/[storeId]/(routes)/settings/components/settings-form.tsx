"use client";

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { Trash } from "lucide-react";
import { Store } from "@prisma/client";
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
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

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Deve ter 1 ou mais caracteres" }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [ open, setOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success("Loja atualizada.")

    } catch (error) {
      toast.error("Algo deu errado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title="Configurações" 
          description="Gerenciar preferências de loja" 
        />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4"/>
        </Button>
      </div>
      <Separator/>
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
                      placeholder="Nome da loja"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            Salvar mudanças
          </Button>
        </form>
      </Form>
    </>
  )
}