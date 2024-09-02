import { Navigate, useNavigate, useParams } from "react-router-dom";
import BookFormComponent from "../components/BookForm";
import { useQuery } from "@tanstack/react-query";
import { getBookByISBN } from "../api/BooksApi";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";


function EditBookView() {

    const params = useParams()
    const isbn = params.isbn!

    const navigate = useNavigate();

    const { data: book, isLoading, isError: bookError } = useQuery({
        queryKey: ['book', isbn],
        queryFn: () => getBookByISBN(parseInt(isbn)),
        retry: 1
    });

    const { data: user, isLoading: authLoading, isError: authError } = useAuth();

    useEffect(() => {
        if (authError) {
            navigate('/login');
        }
    }, [authError, user, navigate]);

    if(bookError) return <Navigate to='/404' />
    return (
        <div className="relative min-h-[90vh] bg-[url('/img/books3.png')] bg-center bg-cover bg-no-repeat bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
                {isLoading || authLoading ? (
                    <div className="loader2 mt-[20%]" />
                ) : (
                    <>
                        { user && book && <BookFormComponent book={book} mode="edit" /> }
                    </>
                )}
            </div>
        </div>
    )
}

export default EditBookView;