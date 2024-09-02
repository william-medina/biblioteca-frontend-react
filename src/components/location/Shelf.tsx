import { useLocation, useNavigate } from "react-router-dom";
import { Book, CurrentLocation, Location, ShelfType } from "../../types";
import { useEffect, useRef } from "react";
import SectionBooks from "./SectionBooks";

type ShelfProps = {
    data: Location;
    activeShelf: ShelfType;
    currentLocation: CurrentLocation;
};

function Shelf({ data, activeShelf, currentLocation }: ShelfProps) {

    const navigate = useNavigate();
    const location = useLocation();

    const sectionBooksRef = useRef<HTMLDivElement | null>(null);

    // Desplazar a la sección cuando cambia
    useEffect(() => {
        if (sectionBooksRef.current && currentLocation.section) {
            const element = sectionBooksRef.current;
            const offsetTop = element.offsetTop;
            const offsetAdjustment = -20;

            window.scrollTo({
                top: offsetTop + offsetAdjustment,
                behavior: "smooth",
            });
        }
    }, [currentLocation]);

    // Encontrar el estante activo
    const selectedShelf = data.find(shelf => shelf.shelf === activeShelf);

    // Obtener el rango de libros para una sección específica
    const getBookRangeForSection = (sectionId: string): string => {
        if (!selectedShelf) return '0';
        const sectionData = selectedShelf.sections.find(section => section.section === sectionId);
        const bookCount = sectionData?.books.length ?? 0;
        return bookCount > 0 ? `1 - ${bookCount}` : '0';
    };

    // Obtener la lista de libros de una sección específica
    const getBooksInSection = (): Book[] | [] => {
        const selectedShelf = data.find(shelf => shelf.shelf === currentLocation.shelf);
        if (!selectedShelf) return [];
        return selectedShelf.sections.find(section => section.section === currentLocation.section)?.books ?? [];
    };

    // Renderizar encabezado del estante
    const renderShelfHeader = (startSection: string, endSection: string) => (
        <div className="flex bg-[#00000099]">
            <div className="py-2 w-full border-2 border-white text-center font-bold text-sm mobile-l:text-lg text-white">
                {startSection} &nbsp; - &nbsp; {endSection}
            </div>
        </div>
    );

    // Renderizar una fila de secciones
    const renderSectionRow = (sectionIds: string[]) => (
        <div className="flex">
            {sectionIds.map(sectionId => {
                const bookRange = getBookRangeForSection(sectionId);
                const isClickable = bookRange !== '0';

                return (
                    <button
                        key={sectionId}
                        type="button"
                        className={`py-1 mobile-l:py-2 w-full border-2 border-white text-center text-sm mobile-l:text-lg duration-300 
                                    ${isClickable ? 'hover:bg-[#00000069] cursor-pointer' : 'cursor-default'} 
                                    ${currentLocation.section === sectionId && currentLocation.shelf === activeShelf ? 'cursor-default bg-[#00000069]' : ''}
                                    ${currentLocation.position && currentLocation.section === sectionId && currentLocation.shelf === activeShelf ? 'animate-blinking' : ''} `}
                        onClick={() => isClickable && navigate(`${location.pathname}?shelf=${activeShelf}&section=${sectionId}`)}
                    >
                        <p className="font-bold text-white">{currentLocation.section === sectionId && currentLocation.shelf === activeShelf ? `- ${sectionId} -` : sectionId}</p>
                        <p>{`[${bookRange}]`}</p>
                    </button>
                );
            })}
        </div>
    );

    return (
        <>
            { activeShelf === 'P' && (
                 <div className="text-n1 flex gap-10 flex-col md:flex-row">
                    <div className="bg-form-bg w-[18rem] mobile-l:w-[22rem] border-[5px] border-white">
                        {renderShelfHeader('A', 'J')}
                        {renderSectionRow(['A', 'B', 'C'])}
                        {renderSectionRow(['D', 'E'])}
                        {renderSectionRow(['F', 'G', 'H'])}
                        {renderSectionRow(['I', 'J'])}
                    </div>
                    <div className="bg-form-bg w-[18rem] mobile-l:w-[22rem] border-[5px] border-white">
                        {renderShelfHeader('K', 'T')}
                        {renderSectionRow(['K', 'L', 'M'])}
                        {renderSectionRow(['N', 'O'])}
                        {renderSectionRow(['P', 'Q', 'R'])}
                        {renderSectionRow(['S', 'T'])}
                    </div>
                </div>
            )}

            { activeShelf === 'E' && (
                 <div className="text-n1 flex gap-10">
                    <div className="bg-form-bg w-[18rem] mobile-l:w-[22rem] border-[5px] border-white">
                        {renderShelfHeader('A', 'J')}
                        {renderSectionRow(['A', 'B'])}
                        {renderSectionRow(['C', 'D'])}
                        {renderSectionRow(['E', 'F'])}
                        {renderSectionRow(['G', 'H'])}
                        {renderSectionRow(['I', 'J'])}
                    </div>
                </div>
            )}
            {currentLocation.shelf && currentLocation.section && (
                <div ref={sectionBooksRef} className="mt-10">
                    <SectionBooks books={getBooksInSection()} position={currentLocation.position} />
                </div>
            )}
        </>
    );
}

export default Shelf;