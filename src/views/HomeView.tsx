import { useQuery } from "@tanstack/react-query";
import { getBookCount, getRandomBooks } from "../api/BooksApi";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { capitalizeWords } from "../utils";

function HomeView() {
    const [isImageErrors, setIsImageErrors] = useState<number[]>([]);
    const [isImageLoading, setIsImageLoading] = useState<number[]>([]);
    
    const timestamp = useMemo(() => new Date().getTime(), []);
    
    const {
        data: bookCount,
        isLoading: isLoadingBookCount,
        isError: isErrorCount
    } = useQuery({
        queryKey: ['bookCount'],
        queryFn: getBookCount,
    });

    const {
        data: randomBooks,
        isLoading: isLoadingRandomBooks,
        isError: isErrorRandomBooks
    } = useQuery({
        queryKey: ['randomBooks'],
        queryFn: () => getRandomBooks(5),
        refetchOnWindowFocus: false,
    });
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(()=> {
        if(randomBooks) {
            randomBooks.map(book => {setIsImageLoading(prev => [...prev, book.isbn])})
        }
    },[randomBooks])

    if (isLoadingBookCount && isLoadingRandomBooks || isErrorRandomBooks || isErrorCount) return (
        <div className="relative min-h-[90vh] bg-[url('/img/books2Mobile.png')]  m500:bg-[url('/img/books2.png')] bg-cover bg-no-repeat bg-opacity-50 mb-2">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="loader mt-[20%]" />
            </div>
        </div>
    )

    if (randomBooks && bookCount) return (
        <>
            <section className="relative bg-[url('/img/books2Mobile.png')] m500:bg-[url('/img/books2.png')] bg-cover bg-no-repeat bg-opacity-50 border-b-8 border-white">
                <div className="absolute inset-0 bg-black opacity-50" />
                <h2 className="relative z-10 text-3xl pt-8 pb-6 m500:pt-6 m500:pb-0 font-bold text-center text-n1 flex items-center justify-center">
                    <img src="/icons/book.svg" alt="Libro" className="h-6 w-6 invert-[100%] mr-2" />
                    Libros al Azar
                    <img src="/icons/book.svg" alt="Libro" className="h-6 w-6 invert-[100%] ml-2" />
                </h2>
                <div className="relative z-10 flex flex-col gap-6 m500:gap-0 xl:gap-10 m500:flex-row justify-evenly xl:justify-center items-center min-h-[19rem] sm:min-h-[22rem] md:min-h-[28rem] pb-10 m500:pb-6 md:pb-10 home-covers">
                    {randomBooks.map(book => (
                        <Link
                            to={`/book/${book.isbn}`}
                            key={book.isbn}
                            className="relative bg-form-bg border-[2.5px] flex items-center border-white rounded-md p-3 sm:p-4 md:p-6 min-h-60 sm:min-h-72 md:min-h-80 hover:bg-form-dark duration-300"
                        >
                            {isImageLoading.includes(book.isbn) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="loader"></div>
                                </div>
                            )}
                            {isImageErrors.includes(book.isbn) ? (
                                <div className="relative inset-0 w-52 m500:w-32 sm:w-40 md:w-48 h-80 m500:h-52 md:h-72 flex flex-col items-center justify-center text-[1.1rem] text-white text-center font-bold px-3">
                                    <div className="absolute top-0 mt-2 text-xs">- Sin portada -</div>
                                    {capitalizeWords(book.title)}
                                </div>
                            ) : (
                                <img
                                    className="w-52 m500:w-32 sm:w-40 md:w-48"
                                    src={`${import.meta.env.VITE_API_URL}/covers/${book.isbn}.jpg?t=${timestamp}`}
                                    alt={`Libro: ${book.title}`}
                                    onLoad={() => setIsImageLoading(prev => prev.filter(isbn => isbn !== book.isbn))}
                                    onError={() => {
                                        setIsImageErrors(prev => [...prev, book.isbn]);
                                        setIsImageLoading(prev => prev.filter(isbn => isbn !== book.isbn));
                                    }}
                                    width={13}
                                    height={16}
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </section>
            <section className="relative h-[65vh] bg-[url('/img/books.jpg')] bg-cover bg-center bg-no-repeat flex flex-col m500:flex-row justify-evenly m500:justify-around 3xl:justify-evenly border-b-8 border-white">
                <div className="absolute inset-0 bg-black opacity-50" />
                <div className="relative z-10 flex flex-col justify-center text-center items-center text-[2.1rem] font-bold leading-9">
                    <Link to='inventory' className="text-n1 hover:text-white duration-300">
                        <div className="flex items-center gap-2">
                            <img className="w-[2.4rem] h-[2.4rem] invert" src="/icons/book-open.svg" alt="Icono Libro Abierto" />
                            <p>{bookCount.count} Libros</p>
                        </div>
                        <p> Almacenados</p>
                    </Link>
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center">
                    <Link to="/book/create" className="bg-form-bg text-n1 font-bold text-[1.5rem] px-6 py-3 flex items-center gap-1 hover:bg-custom-green duration-300">
                        <img className="h-6 w-6 invert" src="/icons/plus.svg" alt="Signo Más" />
                        <p>Agregar Libro</p>
                    </Link>
                </div>
            </section>
        </>
    );
}

export default HomeView;
