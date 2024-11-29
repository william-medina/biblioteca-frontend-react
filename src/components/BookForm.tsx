import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook, deleteBook, updateBook } from "../api/BooksApi";
import ErrorMessage from "../components/ErrorMessage";
import { useForm } from "react-hook-form";
import { Book, BookForm } from "../types";
import { closeAllSwalAlerts, showDeleteConfirmation, showSuccessAlert } from "../utils/alertsUtils";
import { capitalizeWords } from "../utils";

type BookFormProps = {
    book?: Book
    mode: 'create' | 'edit';
}

function BookFormComponent({book, mode }: BookFormProps) {

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isImageErrors, setIsImageErrors] = useState<number[]>([]);
    const [isImageLoading, setIsImageLoading] = useState<number[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [bookErrorMessage, setBookErrorMessage] = useState<string | null>(null);

    const timestamp = useMemo(() => new Date().getTime(), []);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Cerrar alertas de SweetAlert2 cuando el componente se desmonte
        return () => {
            closeAllSwalAlerts();
        };
    }, []);

    const initialValues: BookForm = {
        isbn: book?.isbn || null,
        title: book?.title ? capitalizeWords(book.title) : '',
        author: book?.author && book.author !== 'S.A' ? capitalizeWords(book.author) : '',
        publisher: book?.publisher && book.publisher !== 'S.E' ? capitalizeWords(book.publisher) : '',
        publication_year: (book?.publication_year && book.publication_year !== 'S.F') ? book.publication_year : '',
        location: book?.location && book.location !== '---' ? book.location : '',
        cover: undefined,
    };

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ defaultValues: initialValues });

    const mutation = useMutation({
        mutationFn: mode === 'create' ? createBook : (data: FormData) => updateBook(book?.isbn!, data),
        onError: (error) => {
            setBookErrorMessage(error.message);
        },
        onSuccess: () => {
            if(mode === 'create') {
                showSuccessAlert('Libro Agregado');
                reset();
                setBookErrorMessage(null);
                setSelectedFileName(null);
            } else {
                showSuccessAlert('Libro Actualizado');
                queryClient.removeQueries({queryKey: ['book']});
                setTimeout(() => {
                    navigate(`/book/${watch('isbn')}`);
                }, 3000);
                
            } 
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (bookIsbn: number) => deleteBook(bookIsbn),
        onError: (error) => {
            setBookErrorMessage(error.message);
        },
        onSuccess: () => {
            showSuccessAlert('Libro Eliminado');
            queryClient.removeQueries({queryKey: ['book']});
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
            const fileUrl = URL.createObjectURL(file);
            setPreviewImage(fileUrl);
        } else {
            setSelectedFileName(null);
            setPreviewImage(null);
        }
    };

    const handleSubmitForm = (data: BookForm) => {
        const formDataToSend = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'cover') {
                formDataToSend.append(key, value as string);
            }
        });
        if (data.cover && data.cover.length > 0) {
            formDataToSend.append('cover', data.cover[0]);
        }
        mutation.mutate(formDataToSend);
    };

    const handleDelete = async () => {
        try {
            const confirmed = await showDeleteConfirmation();
            if (confirmed) {
                deleteMutation.mutate(book?.isbn!);
            }
        } catch (error) {
            console.error('Error mostrando la confirmación:', error);
        }
    };
    

    return (
        <div className="my-[1.5rem] bg-form-bg p-4 mobile-s:p-6 mobile-l:p-8 w-[18rem] mobile-s:w-[22rem] mobile-l:w-[25rem] sm:w-[35rem]">
            <h2 className="text-n1 text-3xl mobile-s:text-4xl font-bold text-center mb-6">
                {mode === 'create' ? 'Agregar Libro' : 'Editar Libro'}
            </h2>
            { mode === 'edit' && book && (
                <div className="w-full flex justify-center mb-3">
                    {isImageLoading.includes(book.isbn) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="loader"></div>
                        </div>
                    )}
                    {isImageErrors.includes(book.isbn) && typeof(previewImage) !== 'string' ? (
                        <div className="inset-0 w-44 h-[14rem] flex flex-col items-center justify-center border-[2.5px] border-n1 rounded-xl text-n1 text-xl text-center font-bold px-3">
                            - Sin portada -
                        </div>
                    ) : (
                        <img
                            className="w-44"
                            src={previewImage ? previewImage : `${import.meta.env.VITE_API_URL}/covers/${book.isbn}.jpg?t=${timestamp}`}
                            alt={`Libro: ${book.title}`}
                            onLoad={() => setIsImageLoading(prev => prev.filter(isbn => isbn !== book.isbn))}
                            onError={() => {
                                setIsImageErrors(prev => [...prev, book.isbn]);
                                setIsImageLoading(prev => prev.filter(isbn => isbn !== book.isbn));
                            }}
                        />
                    )}
                </div>
            )}
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                noValidate
            >
                {bookErrorMessage && (
                    <ErrorMessage>{bookErrorMessage}</ErrorMessage>
                )}
                <div>
                    <label className="text-n1 text-lg mobile-s:text-xl sm:text-2xl font-bold" htmlFor="title">Título</label>
                    <div className="flex bg-form-bg p-2 border-b-2 borde-white">                                        
                        <input 
                            className="w-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-s:text-[1.3rem] sm:text-[1.4rem] leading-4 mobile-s:leading-5" 
                            type="text" 
                            id="title" 
                            autoComplete="off"
                            {...register("title", {
                                required: "El título es obligatorio",
                            })}
                        />
                    </div>
                    {errors.title && (
                        <ErrorMessage>{errors.title.message}</ErrorMessage>
                    )}
                </div>

                <div className="mt-3">
                    <label className="text-n1 text-lg mobile-s:text-xl sm:text-2xl font-bold" htmlFor="author">Autor</label>
                    <div className="flex bg-form-bg p-2 border-b-2 borde-white">                                        
                        <input 
                            className="w-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-s:text-[1.3rem] sm:text-[1.4rem] leading-4 mobile-s:leading-5" 
                            type="text" 
                            id="author" 
                            autoComplete="off"
                            {...register("author")}
                        />
                    </div>
                </div>

                <div className="mt-3">
                    <label className="text-n1 text-lg mobile-s:text-xl sm:text-2xl font-bold" htmlFor="publisher">Editorial</label>
                    <div className="flex bg-form-bg p-2 border-b-2 borde-white">                                        
                        <input 
                            className="w-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-s:text-[1.3rem] sm:text-[1.4rem] leading-4 mobile-s:leading-5" 
                            type="text" 
                            id="publisher" 
                            autoComplete="off"
                            {...register("publisher")}
                        />
                    </div>
                </div>

                <div className="flex justify-between gap-4 mobile-s:gap-6 sm:gap-10 w-full">
                    <div className="mt-3 w-[8rem] mobile-l:w-[10rem]">
                        <label className="text-n1 text-lg mobile-s:text-xl sm:text-2xl font-bold" htmlFor="publication_year">Fecha</label>
                        <div className="flex bg-form-bg p-2 border-b-2 borde-white">                                        
                            <input 
                                className="w-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-s:text-[1.3rem] sm:text-[1.4rem] leading-4 mobile-s:leading-5" 
                                type="text" 
                                id="publication_year" 
                                autoComplete="off"
                                {...register("publication_year")}
                            />
                        </div>
                    </div>
                    <div className="mt-3 w-full">
                        <label className="text-n1 text-lg mobile-s:text-xl sm:text-2xl font-bold" htmlFor="isbn">ISBN</label>
                        <div className="flex bg-form-bg p-2 border-b-2 borde-white">
                            <input 
                                className="w-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-s:text-[1.3rem] sm:text-[1.4rem] leading-4 mobile-s:leading-5" 
                                type="text" 
                                id="isbn" 
                                autoComplete="off"
                                {...register("isbn", {
                                    required: "El ISBN es obligatorio",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "El ISBN solo debe contener números",
                                    },
                                })}
                            />
                        </div>
                        {errors.isbn && (
                            <ErrorMessage>{errors.isbn.message}</ErrorMessage>
                        )}
                    </div>
                </div>
                <div className="flex justify-between gap-4 mobile-s:gap-6 sm:gap-10 w-full">
                    <div className="mt-3">
                        <label className="text-n1 text-lg mobile-s:text-xl sm:text-2xl font-bold" htmlFor="cover">Portada</label>
                        <div className={`${selectedFileName ? 'bg-custom-green' : 'bg-form-bg'} relative h-[2.53rem] mobile-s:h-[2.7rem] sm:h-[2.8rem] border-b-2 borde-white cursor-pointer flex items-center`}>
                            <input
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                type="file"
                                id="cover"
                                accept=".jpg"
                                {...register("cover", {
                                    validate: {
                                        checkFileType: (files) => {
                                            if (!files || files.length === 0) return true;
                                            const file = files[0];
                                            if (file.type !== 'image/jpeg') return 'Solo se aceptan archivos JPG';
                                            return true;
                                        },
                                    },
                                })}
                                onChange={handleFileChange}
                            />
                            <span className={`${selectedFileName ? 'text-left' : 'text-center'} text-n1 text-[1.1rem] mobile-s:text-[1.2rem] sm:text-[1.4rem] w-[10rem] mobile-s:w-[12rem] mobile-l:w-[14rem] sm:w-[20rem] px-2 truncate`}>
                                {selectedFileName
                                    ? `${selectedFileName}`
                                    : ' - Seleccionar - '}
                            </span>
                        </div>
                        {errors.cover && (
                            <ErrorMessage>{errors.cover.message}</ErrorMessage>
                        )}
                    </div>

                    <div className="mt-3 w-full">
                        <label className="text-n1 text-lg mobile-s:text-xl sm:text-2xl font-bold" htmlFor="location">Ubicación</label>
                        <div className="flex bg-form-bg p-2 border-b-2 borde-white">                                        
                            <input 
                                className="w-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-s:text-[1.3rem] sm:text-[1.4rem] leading-4 mobile-s:leading-5" 
                                type="text" 
                                id="location" 
                                autoComplete="off"
                                {...register("location")}
                            />
                        </div>
                    </div>
                </div>

                { mode === 'create' ? (
                    <input 
                        type="submit" 
                        value="Ingresar"
                        className="w-full mt-8 bg-black text-white text-base mobile-s:text-lg mobile-l:text-xl p-3 mobile-l:p-4 cursor-pointer hover:bg-custom-green duration-300" 
                    />
                ) : (
                    <div className="flex gap-3 mobile-l:gap-5 justify-between">
                        <input 
                            type="submit" 
                            value="Actualizar"
                            className="w-[60%] mt-8 bg-black text-white text-base mobile-s:text-lg mobile-l:text-xl p-3 mobile-l:p-4 cursor-pointer hover:bg-custom-green duration-300" 
                        />
                        <button
                            type="button"
                            className="w-[40%] mt-8 bg-black text-white text-base mobile-s:text-lg mobile-l:text-xl p-3 mobile-l:p-4 cursor-pointer hover:bg-red-600 duration-300" 
                            onClick={handleDelete}
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default BookFormComponent;