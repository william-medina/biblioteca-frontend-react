import { Link } from "react-router-dom";

function NotFoundView() {
    return (
        <div className="relative min-h-screen bg-[url('/img/books3.png')] bg-center bg-cover bg-no-repeat bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-60" />
            <div className="relative z-10 flex flex-col items-center justify-center mt-[22%] text-center px-8">
                <h2 className="font-extrabold text-3xl mobile-s:text-4xl text-white mb-4">Página No Encontrada</h2>
                <p className="text-lg text-n1">
                    Parece que la página que buscas no está disponible. ¿Por qué no vuelves a {' '}
                    <Link className="text-n1 hover:text-gray-400 font-bold duration-300 underline" to={'/'}>
                        Inicio
                    </Link>
                    ?
                </p>
            </div>
        </div>
    );
}

export default NotFoundView