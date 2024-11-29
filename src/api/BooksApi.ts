import { isAxiosError } from "axios"
import api from "../config/axios"
import { Book, bookArraySchema, bookCountSchema, bookSchema, locationSchema } from "../types";

export async function getBookCount() {
    try {
        const { data } = await api('/books/count');
        const response = bookCountSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getRandomBooks(count: number) {
    try {
        const { data } = await api(`/books/random/${count}`);
        const response = bookArraySchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getAllBooks(sortBy: string) {
    try {
        const { data } = await api(`/books/${sortBy}`);
        const response = bookArraySchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getBooksByKeyword(keyword: string) {
    try {
        const { data } = await api(`/books/search/${keyword}`);
        const response = bookArraySchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getBookByISBN(isbn: Book['isbn']) {
    try {
        const { data } = await api(`/books/isbn/${isbn}`);
        const response = bookSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}


export async function createBook(formData: FormData) {
    try {
        const { data } = await api.post<string>('/books', formData);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function updateBook(bookIsbn: number, formData: FormData) {
    try {

        // EXPRESS - SPRING
        const { data } = await api.put<string>(`/books/${bookIsbn}`, formData);
        // END EXPRESS - SPRING
  
        // LARAVEL
        //formData.append('_method', 'PUT');
        //const { data } = await api.post<string>(`/books/${bookIsbn}`, formData);
        // END LARAVEL

        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function deleteBook(bookIsbn: number) {
    try {
        const { data } = await api.delete<string>(`/books/${bookIsbn}`);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}

export async function getLocationBooks() {
    try {
        const { data } = await api('/books/location');
        const response = locationSchema.safeParse(data);
        if(response.success) {
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }
}