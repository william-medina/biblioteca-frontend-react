import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getBookByISBN } from "../api/BooksApi";
import { capitalizeWords, parseLocation } from "../utils";

function BookView() {

    const [isImageErrors, setIsImageErrors] = useState<number[]>([]);
    const [isImageLoading, setIsImageLoading] = useState<number[]>([]);
    
    const timestamp = useMemo(() => new Date().getTime(), []);

    const [currentLocation, setCurrentLocation] = useState({
        shelf: '',
        section: '',
        position: 0
    });

    const params = useParams();
    const isbn = params.isbn!;

    const { data: book, isLoading, isError } = useQuery({
        queryKey: ['book', isbn],
        queryFn: () => getBookByISBN(parseInt(isbn)),
        retry: false
    })

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        if(book) {
            const locationData = parseLocation(book.location);
            setCurrentLocation(locationData);
        }
    }, [book])


    if(isError) return <Navigate to='/404' />
    return (
        <div className="relative min-h-[90vh] bg-[url('/img/wood.png')] bg-repeat-y bg-[length:100%_auto] bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
                {isLoading ? (
                    <div className="loader2 mt-[20%]"></div>
                ) : (
                    <>
                        {book && (
                            <div className="bg-form-bg p-6 mobile-l:p-8 w-[88%] mobile-l:w-[80%] lg:w-[70%] xl:w-[60%] max-w-[900px] my-5">
                                <h2 className="text-white text-2xl mobile-s:text-3xl font-bold mb-8 text-center">Información del libro</h2>
                                <div className="flex flex-col md:flex-row items-center gap-10 min-h-[28rem] mb-8">
                                    {isImageLoading.includes(book.isbn) && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="loader"></div>
                                        </div>
                                    )}
                                    {isImageErrors.includes(book.isbn) ? (
                                        <div className="inset-0 w-80 h-[28rem] flex flex-col items-center justify-center border-[2.5px] border-n1 rounded-xl text-n1 text-xl text-center font-bold px-3">
                                            - Sin portada -
                                        </div>
                                    ) : (
                                        <img
                                            className="w-80"
                                            src={`${import.meta.env.VITE_API_URL}/covers/${book.isbn}.jpg?t=${timestamp}`}
                                            alt={`Libro: ${book.title}`}
                                            onLoad={() => setIsImageLoading(prev => prev.filter(isbn => isbn !== book.isbn))}
                                            onError={() => {
                                                setIsImageErrors(prev => [...prev, book.isbn]);
                                                setIsImageLoading(prev => prev.filter(isbn => isbn !== book.isbn));
                                            }}
                                        />
                                    )}
                                    <div className="m-auto text-center text-white font-bold text-[1.1rem] mobile-l:text-[1.125rem] leading-5">
                                        <p className="select-none">ISBN</p>
                                        <p className="text-n1 font-normal text-[0.9rem] mobile-l:text-[1rem] mb-5">{book.isbn}</p>
                                        <p className="select-none">Título</p>
                                        <p className="text-n1 font-normal mb-5">{capitalizeWords(book.title)}</p>
                                        <p className="select-none">Autor</p>
                                        <p className="text-n1 font-normal mb-5">{capitalizeWords(book.author)}</p>
                                        <p className="select-none">Editorial</p>
                                        <p className="text-n1 font-normal mb-5">{capitalizeWords(book.publisher)}</p>
                                        <p className="select-none">Fecha</p>
                                        <p className="text-n1 font-normal mb-5">{book.publication_year}</p>
                                    </div>
                                </div>
                                <div className="border-y-[2.5px] border-n1 flex justify-between gap-4 mobile-l:gap-7 text-white text-base mobile-s:text-lg mobile-l:text-xl font-bold">
                                {book.location !== '---' ? (
                                        <Link 
                                            to={`/location?shelf=${currentLocation.shelf}&section=${currentLocation.section}&position=${currentLocation.position}`}
                                            className="flex justify-center items-center bg-form-dark w-full my-3 p-3 hover:bg-custom-green duration-300"
                                        >
                                            <img 
                                                className="h-4 w-4 mobile-s:h-5 mobile-s:w-5 invert mr-1"
                                                src="/icons/location.svg" 
                                                alt="Icono Ubicación" 
                                            />
                                            Ubicación
                                        </Link>
                                    ) : (
                                        <div 
                                            className="flex justify-center items-center bg-form-dark w-full my-3 p-3 cursor-not-allowed opacity-50 select-none"
                                        >
                                            <img 
                                                className="h-4 w-4 mobile-s:h-5 mobile-s:w-5 invert mr-1 select-none"
                                                src="/icons/location.svg" 
                                                alt="Icono Ubicación" 
                                            />
                                            Ubicación
                                        </div>
                                    )}
                                    <Link 
                                        to={`/book/${book.isbn}/edit`}
                                        className="flex justify-center items-center bg-form-dark w-full my-3 p-3 hover:bg-custom-green duration-300"
                                    >
                                        <img 
                                            className="h-4 w-4 mobile-s:h-5 mobile-s:w-5 invert mr-1"
                                            src="/icons/edit.svg" 
                                            alt="Icono Editar" 
                                        />
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default BookView