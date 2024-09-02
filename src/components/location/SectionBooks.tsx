import { useEffect } from "react"
import { Book, CurrentLocation } from "../../types"
import { capitalizeWords, parseLocation } from "../../utils"
import { useNavigate } from "react-router-dom"

type SectionBooksProps = {
    books: Book[]
    position: CurrentLocation['position']
}

function SectionBooks({books, position} : SectionBooksProps) {

    const navigate = useNavigate();

    useEffect(() => {
        if (books.length === 0 || (position !== null && ( position <= 0 ||  position > books.length || isNaN(position)))) {
            navigate('/404');
        }
    }, [])

    return (
        <table className="bg-form-bg m-3 border-separate border-[2.5px] border-white rounded-lg p-2 text-[0.7rem] mobile-s:text-[0.8rem] mobile-l:text-[1rem] leading-[0.8rem] mobile-s:leading-[0.9rem] mobile-l:leading-5 tracking-tight">
            <thead className="text-white">
                <tr>
                    <th>Título</th>
                    <th>Ubicación</th>
                </tr>
            </thead>
            <tbody className="text-white">
                {books.map(book => (
                    <tr key={book.isbn} className={`${parseLocation(book.location).position === position ? 'bg-[#00000069] animate-blinking font-bold' : ''}`}>
                        <td className={` ${parseLocation(book.location).position === position ? 'py-1' : ''} border-t-[2.2px] border-white`}>{capitalizeWords(book.title)}</td>
                        <td className="border-t-[2.2px] border-white text-center">{book.location}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default SectionBooks