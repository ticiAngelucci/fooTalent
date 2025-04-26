import { useState, useEffect } from 'react';
import Loader from '@/shared/components/loader/loader';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Button } from '@/shared/components/ui/button';

interface Character {
    id: number;
    role: string;
    email: string;
}

const ITEMS_PER_PAGE = 10; 

const GetAllUsers = () => {
    const [allUsers, setAllUsers] = useState<Character[]>([]); 
    const [displayedUsers, setDisplayedUsers] = useState<Character[]>([]); 
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true); 

    useEffect(() => {
        const urlApi = `https://alura-geek-api-kohl.vercel.app/users`;

        async function loadUsers() {
            try {
                setLoading(true);
                const response = await axios.get(urlApi);

                if (!response) {
                    throw new Error('Error fetching data');
                }

                const data = await response.data;
                setAllUsers(data);
                setHasMore(data.length > ITEMS_PER_PAGE);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, []);

    useEffect(() => {
        
        const endIndex = currentPage * ITEMS_PER_PAGE;
        const usersToShow = allUsers.slice(0, endIndex);
        setDisplayedUsers(usersToShow);
        
        
        setHasMore(endIndex < allUsers.length);
    }, [allUsers, currentPage]);

    const loadMoreUsers = () => {
        setCurrentPage(prev => prev + 1);
    };

    if (loading && allUsers.length === 0) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen py-8 relative">
            <h1 className="text-3xl mb-6">Lista de usuarios registrados</h1>
            
            <div className="text-center my-4">
                {!loading && allUsers.length === 0 && (
                    <p className="text-red-500">No hay usuarios disponibles</p>
                )}
                {!loading && allUsers.length > 0 && (
                    <p className="text-gray-600">
                        Mostrando {displayedUsers.length} de {allUsers.length} usuarios
                    </p>
                )}
            </div>

            <div className="overflow-x-auto w-full max-w-4xl mx-auto">
                <Table>
                    <TableCaption>Lista de usuarios registrados en el sistema.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            {hasMore && (
                <div className="mt-4">
                    <Button
                        onClick={loadMoreUsers}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Cargar más usuarios'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default GetAllUsers;