import { Book } from "../types";

export function capitalizeWords(text: string): string {
    // Expresión regular para dividir la cadena por espacios o puntos, pero manteniendo los puntos en la salida
    const wordsArray = text.split(/([.\s]+)/);

    // Capitaliza la primera letra de cada palabra y conserva los delimitadores originales
    const capitalizedText = wordsArray
        .map(word => {
            // Solo capitaliza si la palabra no es un espacio o un punto
            return /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(word) ? capitalizeFirstLetter(word) : word;
        })
        .join(''); // Une las palabras y delimitadores sin añadir espacios adicionales

    return capitalizedText.trim();
}

export function capitalizeFirstLetter(text: string): string {
    // Encuentra la primera letra visible en la cadena, ignorando signos de puntuación y números
    const match = text.match(/(?:[!?]|(?:\d+))?\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ])/);

    if (!match) {
        // No hay letras en la cadena
        return text;
    }

    // Encuentra el índice del primer carácter no espacial
    const firstLetterIndex = match.index! + match[0].length - match[1].length;
    
    // Capitaliza la primera letra encontrada
    const firstChar = text.charAt(firstLetterIndex);
    const capitalizedChar = firstChar.toLocaleUpperCase('es'); // Usa 'es' para manejar caracteres acentuados en español

    return text.slice(0, firstLetterIndex) + 
           capitalizedChar + 
           text.slice(firstLetterIndex + 1).toLocaleLowerCase('es'); // Usa 'es' para manejar caracteres acentuados en español
}

export const parseLocation = (location: Book['location']) => {
    const [shelf, sectionPosition] = location.split('-');
    const section = sectionPosition.charAt(0);
    const position = parseInt(sectionPosition.substring(1));

    return { shelf, section, position };
};