import { useQuery } from "@tanstack/react-query"
import { getAllBooks } from "../api/BooksApi"
import { ChangeEvent, useEffect, useState } from "react"
import { capitalizeWords } from "../utils";

function InventoryView() {

    const [order, setOrder] = useState<string>('title');

    const { data, isLoading } = useQuery({
        queryKey: ['allBooks', order],
        queryFn: () => getAllBooks(order)
    })

    useEffect(() => {
        window.scrollTo(-10, -10);
    }, [])

    const handleChange  = (e : ChangeEvent<HTMLSelectElement>) => setOrder(e.target.value as string);

    return (
        <div className="relative min-h-[90vh] bg-[url('/img/wood.png')] bg-repeat-y bg-[length:100%_auto] bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-n1 text-3xl mobile-s:text-4xl font-bold mb-4">Inventario</h2>
                <div className="text-n1 text-xl mobile-s:text-2xl font-bold">Ordenar por: &nbsp;
                    <select 
                        className="bg-form-bg font-medium text-lg mobile-s:text-xl p-1 mb-2 outline-none hover:text-black hover:bg-white cursor-pointer duration-300" 
                        name="orderBy" 
                        id="orderBy"
                        onChange={handleChange}
                    >
                        <option className="text-black" value="title">Título</option>
                        <option className="text-black" value="author">Autor</option>
                        <option className="text-black" value="publisher">Editorial</option>
                        <option className="text-black" value="publication_year">Fecha</option>
                        <option className="text-black" value="id">Creado</option>
                </select>
                </div>
                {isLoading ? (
                    <div className="loader2 mt-[20%]" />
                ) : (
                    <table className="bg-form-bg m-3 border-separate border-[2.5px] border-white rounded-lg p-2 text-[0.7rem] mobile-s:text-[0.8rem] mobile-l:text-[1rem] leading-[0.8rem] mobile-s:leading-[0.9rem] mobile-l:leading-5 tracking-tight">
                        <thead className="text-n1">
                            <tr>
                                <th>Título</th>
                                <th>Autor</th>
                                <th>Editorial</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {data && data.map(book => (
                                <tr key={book.isbn}>
                                    <td className="border-t-[2.2px] border-white">{capitalizeWords(book.title)}</td>
                                    <td className="border-t-[2.2px] border-white">{capitalizeWords(book.author)}</td>
                                    <td className="border-t-[2.2px] border-white">{capitalizeWords(book.publisher)}</td>
                                    <td className="border-t-[2.2px] border-white text-center">{book.publication_year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default InventoryView