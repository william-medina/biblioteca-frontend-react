
import { useNavigate } from 'react-router-dom';
import BookFormComponent from '../components/BookForm';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

function CreateBookView() {

    const navigate = useNavigate();

    const { data: user, isLoading: authLoading, isError: authError } = useAuth();

    useEffect(() => {
        if (authError) {
            navigate('/login');
        }
    }, [authError, user, navigate]);

    return (
        <div className="relative min-h-[90vh] bg-[url('/img/books3.png')] bg-center bg-cover bg-no-repeat bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
                {authLoading ? (
                    <div className="loader2 mt-[20%]"></div>
                ) : (
                    <>
                        { user && <BookFormComponent mode="create" /> }
                    </>
                )}
            </div>
        </div>
    )
}

export default CreateBookView