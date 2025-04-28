import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus } from 'lucide-react'
import { useForm } from 'react-hook-form';
import { UserFormValues, userSchema } from '../schemas/userSchema';
import { userCreate } from '../services/UserServices';
import { useNavigate } from 'react-router-dom';
import { Route } from '@/shared/constants/route';

const AddNewUser = () => {
    const navigate = useNavigate();
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (data: UserFormValues) => {
        try {
            await userCreate(data);
            alert("usuario creado con exito");
            navigate(Route.Dashboard)
        } catch (error) {
            alert(error);
        }
    }
    return (
        <Dialog>
            <DialogTrigger>
                <span className='inline-flex items-center gap-2.5'>Agregar Nuevo <CirclePlus /></span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    Agregar Nuevo Usuario
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Correo electrónico
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="correo@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <Button type='submit' className='w-full'>
                            Agregar
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewUser