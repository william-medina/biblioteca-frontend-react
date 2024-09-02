import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom"
import { getBooksByKeyword } from "../api/BooksApi";
import { capitalizeWords } from "../utils";

function SearchView() {

    const params = useParams();
    const keyword = (params.keyword!).replace(/\+/g, ' ');

    const { data, isLoading } = useQuery({
        queryKey: ['search', keyword],
        queryFn: () => getBooksByKeyword(encodeURIComponent(keyword)),
        retry: false
    })

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="relative min-h-[90vh] bg-[url('/img/wood.png')] bg-repeat-y bg-[length:100%_auto] bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
                {isLoading ? (
                    <div className="loader2 mt-[20%]" />
                ) : (
                    <>
                        {data && (
                            <>
                                <h2 className={`${data.length === 0 ? 'mt-[20%]' : 'my-5'} text-n1 text-2xl mobile-s:text-3xl font-bold mx-6 text-center`}>
                                    {keyword === ' ' ? (
                                        <>{data.length} Libros Almacenados</>
                                    ) : data.length === 0 ? (
                                        <> Ningún libro fue encontrado con la referencia: </>
                                    ) : data.length === 1 ? (
                                        <> 1 libro encontrado con la referencia: </>
                                    ) : (
                                        <> {data.length} libros encontrados con la referencia: </>
                                    )}
                                    <span className="underline text-white">{keyword}</span>
                                </h2>
                                {data.map(book => (
                                    <Link 
                                        to={`/book/${book.isbn}`}
                                        key={book.isbn}
                                        className="group bg-form-bg border-[2.5px] border-white w-[90%] m500:w-[80%] md:w-[60%] max-w-[900px] text-sm mobile-s:text-base m500:text-lg text-n1 rounded-lg mb-3 py-2 px-3 leading-5 m500:leading-6 hover:bg-form-dark duration-300"
                                    >
                                        <p className="font-bold border-b-[1px] m500:border-b-[1.2px] border-white">Título: <span className="font-light text-white group-hover:font-bold duration-300">{capitalizeWords(book.title)}</span></p>
                                        <p className="font-bold">Autor:  <span className="font-light text-white">{capitalizeWords(book.author)}</span></p>
                                        <p className="font-bold">Editorial:  <span className="font-light text-white">{capitalizeWords(book.publisher)}</span></p>
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">Fecha:  <span className="font-light text-white">{book.publication_year}</span></p>
                                            <p className="font-bold text-xs m500:text-sm">ISBN:  <span className="font-light text-white">{book.isbn}</span></p>
                                        </div>
                                    </Link>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default SearchView