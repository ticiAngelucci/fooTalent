import Loader from '@/shared/components/loader/loader';
import { useEffect, useState } from 'react';
interface Character {
    id: number;
    name: string;
    image: string;
    race: string;
    description: string;
    ki: number;
}

const ApiPublica = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);


    useEffect(() => {
        const urlApi = `https://dragonball-api.com/api/characters?page=${page}`;
        async function loadCharacters() {
            try {
                const response = await fetch(urlApi);
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                const data = await response.json();
                setCharacters(prev => {
                    const newItems = data.items.filter(
                        (newItem: Character) => !prev.some(oldItem => oldItem.id === newItem.id)
                    );
                    return [...prev, ...newItems]; });
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            }
        loadCharacters();
        }, [page]);



        if(loading){
            return <Loader/>
        }
    return (
        <div className="bg-gray-100 p-4 h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold text-center my-8 text-gray-800">API Pública Dragon Ball</h1>

            {/* Estado de carga y mensajes */}
            <div className="text-center my-4">
                {!loading && characters.length === 0 && (
                    <p className="text-red-500">No hay personajes disponibles</p>
                )}
                {!loading && characters.length > 0 && (
                    <p className="text-gray-600">Total de personajes: {characters.length}</p>
                )}

            </div>

            {/* Grid de personajes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto">
                {characters.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white flex flex-col items-center justify-center rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 "
                    >
                        <div className="flex-1">

                            <img
                                className="col-span-12  object-cover max-h-[350px]"
                                src={item.image}
                                alt={`${item.name}`}
                            />
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
                            <p className="text-sm text-gray-600 mb-1 text-center">Raza: {item.race}</p>

                            <p className="text-gray-700 text-sm mb-3 line-clamp-3 text-justify">
                                {item.description}
                            </p>

                            <div className="text-center">
                                <span className="text-sm font-semibold text-blue-600">
                                    Ki: {item.ki}
                                </span>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300  mx-auto block"
                onClick={() => {
                    setPage(page + 1);

                }}
            >
                Cargar más personajes
            </button>
        </div>
    );
};

export default ApiPublica;