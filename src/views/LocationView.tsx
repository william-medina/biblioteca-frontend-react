import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { getLocationBooks } from "../api/BooksApi";
import Shelf from "../components/location/Shelf";
import { CurrentLocation, ShelfType } from "../types";
import { useLocation } from "react-router-dom";

function LocationView() {

    const location = useLocation();

    const AVAILABLE_SHELVES = ['P', 'E'];

    const [shelf, setShelf] = useState<ShelfType>('P');
    const [currentLocation, setCurrentLocation] = useState<CurrentLocation>({
        shelf: '',
        section: '',
        position: 0
    });

    const parseQueryParams = () => {
        const searchParams = new URLSearchParams(location.search);
        setCurrentLocation({
            shelf: searchParams.get('shelf') ?? null,
            section: searchParams.get('section') ?? null,
            position: searchParams.get('position') ? parseInt(searchParams.get('position')!) : null
        })
        setShelf(searchParams.get('shelf') && searchParams.get('shelf') !== '' && AVAILABLE_SHELVES.includes(searchParams.get('shelf')!) ? searchParams.get('shelf') as ShelfType : 'P');
    };

    // Ejecutar cuando cambia la ubicación
    useEffect(() => {
        parseQueryParams();
    }, [location.search]); 

    const { data, isLoading } = useQuery({
        queryKey: ['location'],
        queryFn: getLocationBooks
    })

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const handleChange = (e : ChangeEvent<HTMLSelectElement>) => setShelf(e.target.value as ShelfType);

    return (
        <div className="relative min-h-[90vh] bg-[url('/img/wood.png')] bg-repeat-y bg-[length:100%_auto] bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
            {isLoading ? (
                    <div className="loader2 mt-[20%]"></div>
                ) : (
                    <>
                        { data && (
                            <>
                             <h2 className="text-n1 text-3xl font-bold my-5">Ubicación</h2>
                                <div className="text-n1 text-xl mobile-s:text-2xl font-bold mb-5">
                                    <label htmlFor="shelf">Estante: </label>
                                    <select 
                                        className="bg-form-bg ml-2 text-white font-medium text-lg mobile-s:text-xl p-1 mb-2 outline-none hover:text-black hover:bg-white cursor-pointer duration-300" 
                                        name="shelf" 
                                        id="shelf"
                                        value={shelf}
                                        onChange={handleChange}
                                    >
                                        {data.map(shelf => (
                                            <option className="text-black" key={shelf.shelf} value={shelf.shelf} >- {shelf.shelf} -</option>
                                        ))}
                                    </select>
                                </div>
                                {<Shelf data={data} activeShelf={shelf} currentLocation={currentLocation} />}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default LocationView