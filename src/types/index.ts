import { z } from "zod";

export const bookSchema = z.object({
    id: z.number(),
    isbn: z.number(),
    title: z.string(),
    author: z.string(),
    publisher: z.string(),
    publication_year: z.string(),
    location: z.string(),
})

export const bookArraySchema = z.array(bookSchema);
export type Book = z.infer<typeof bookSchema>

export type BookForm = Omit<z.infer<typeof bookSchema>, 'id' | 'isbn'> & {
    isbn: number | null;
    cover?: FileList; 
};

export const bookCountSchema = z.object({
    count: z.number()
})
export type BookCount = z.infer<typeof bookCountSchema>

export type LoginForm = {
    email: string,
    password: string
}

export const userSchema = z.object({
    id: z.number(),
    email: z.string(),
})

export type User = z.infer<typeof userSchema>

export const locationSchema = z.array(
    z.object({
        shelf: z.string(),
        sections: z.array(
            z.object({
                section: z.string(),
                books: z.array(
                    bookSchema
                )
            })
        )
    })
)

export type Location = z.infer<typeof locationSchema>

export type ShelfType = 'P' | 'E';

export type CurrentLocation = {
    shelf: string | null,
    section: string | null,
    position: number | null
}