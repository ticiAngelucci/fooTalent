import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { UserFormValues, userSchema } from '../schemas/userSchema';
import { userEdit } from '../services/UserServices';
import { Route } from '@/shared/constants/route';

interface EditUserProps {
  id: number;
  role: string;
  email: string;
}

const EditUser = ({ id, role, email }: EditUserProps) => {
  const navigate = useNavigate();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: role || "USER",
      email: email || "",
    }
  });

  const onSubmit = async (values: UserFormValues) => {
    try {
      console.log("Datos enviados:", { id, ...values });
      await userEdit(id, values);
      alert("Usuario actualizado con éxito");
      navigate(Route.Dashboard);
    } catch (error: any) {
      alert(error.message || "Error actualizando usuario");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          Editar Usuario
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <FormControl>
                    <Input placeholder="ROL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Guardar Cambios
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
