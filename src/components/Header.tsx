import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function Header() {
    const [keyword, setKeyword] = useState('');
    const [isNavOpen, setIsNavOpen] = useState(false); 
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleMouseEnter = () => {
        setIsNavOpen(true);
    };

    const handleMouseLeave = () => {
        setIsNavOpen(false);
    };

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        queryClient.removeQueries({ queryKey: ['user'] });
        navigate('/login');
    };

    return (
        <header className="bg-black grid grid-cols-[6fr_1fr] grid-rows-header m500:flex justify-between pl-5 fixed top-0 left-0 w-full m500:h-[4.8rem] z-50">
            <h1 className="text-n1 font-bold hover:text-white duration-300 mt-3 m500:mt-0 leading-[1] text-[2.5rem] mobile-s:text-[3.5rem] m500:text-[2.5rem] md:text-[3.2rem] flex items-center col-span-2">
                <Link to="/">BIBLIOTECA</Link>
            </h1>
            <form className="flex items-center col-start-1 row-start-2 my-3 m500:my-0" onSubmit={(e) => e.preventDefault()}>
                <input 
                    className="placeholder-gray-500 w-[85%] m500:w-[8rem] sm:w-[10rem] md:w-[14rem] h-[2.5rem] bg-n1 text-[1.3rem] px-2 outline-0" 
                    placeholder="Buscar libro..."
                    type="text" 
                    name="keyword" 
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} 
                />
                <Link
                    to={`/search/${keyword === '' ? '+' : keyword.trim().replace(/ /g, '+')}`}
                    className="h-10 w-10 bg-n1 hover:bg-custom-green transition duration-300 mr-4 m500:mr-0"
                    type="submit"
                >
                    <img
                        className="p-2.5 hover:invert transition duration-300"
                        src="/icons/search.svg"
                        alt="Icono Buscar"
                        width={40}
                        height={40}
                    />
                </Link>
            </form>
            {/* Menú desplegable en pantallas pequeñas */}
            <div 
                className="group relative flex items-center justify-center hover:bg-n1 duration-300 w-[4rem] m500:w-[5rem] cursor-pointer col-start-2 row-start-2 lg:hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={menuRef}
            >
                <button
                    className="text-n1 text-2xl lg:hidden flex items-center invert w-7 h-7 group-hover:invert-0 duration-300 select-none"
                >
                    <img src="/icons/menu.svg" alt="Menu" width={28} height={28} />
                </button>
                {isNavOpen && (
                    <nav className="absolute top-[4rem] m500:top-[4.8rem] right-0 bg-n1 text-black w-screen m500:w-48 lg:hidden select-none">
                        <ul className="flex flex-col text-[1.5rem]">
                            <li>
                                <Link 
                                    to="/" 
                                    onClick={() => setIsNavOpen(false)} 
                                    className="relative hover:text-white hover:bg-black py-2 pl-14 m500:pl-10 pr-4 flex gap-1 items-center duration-300 w-full"
                                >
                                    <div className="absolute left-0 hover:invert w-full h-full flex items-center">
                                        <img src="/icons/home.svg" alt="Home" className="w-6 h-6 ml-6 m500:ml-3" />
                                    </div>
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/inventory" 
                                    onClick={() => setIsNavOpen(false)} 
                                    className="relative hover:text-white hover:bg-black py-2 pl-14 m500:pl-10 pr-4 flex gap-1 items-center duration-300 w-full"
                                >
                                    <div className="absolute left-0 hover:invert w-full h-full flex items-center">
                                        <img src="/icons/database.svg" alt="Home" className="w-6 h-6 ml-6 m500:ml-3" />
                                    </div>
                                    Inventario
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/location" 
                                    onClick={() => setIsNavOpen(false)} 
                                    className="relative hover:text-white hover:bg-black py-2 pl-14 m500:pl-10 pr-4 flex gap-1 items-center duration-300 w-full"
                                >
                                    <div className="absolute left-0 hover:invert w-full h-full flex items-center">
                                        <img src="/icons/location.svg" alt="Home" className="w-6 h-6 ml-6 m500:ml-3" />
                                    </div>
                                    Ubicación
                                </Link>
                            </li>
                            {localStorage.getItem('AUTH_TOKEN') ? (
                                <li>
                                    <button 
                                        type="button" 
                                        onClick={() => { logout(); setIsNavOpen(false); }} 
                                        className="relative hover:text-white hover:bg-black py-2 pl-14 m500:pl-10 pr-4 flex gap-1 items-center duration-300 w-full"
                                        >
                                        <div className="absolute left-0 hover:invert w-full h-full flex items-center">
                                            <img src="/icons/logout.svg" alt="Home" className="w-6 h-6 ml-6 m500:ml-3" />
                                        </div>
                                        Logout
                                    </button>
                                </li>
                            ) : (
                                <li>
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsNavOpen(false)} 
                                        className="relative hover:text-white hover:bg-black py-2 pl-14 m500:pl-10 pr-4 flex gap-1 items-center duration-300 w-full"
                                        >
                                        <div className="absolute left-0 hover:invert w-full h-full flex items-center">
                                            <img src="/icons/login.svg" alt="Home" className="w-6 h-6 ml-6 m500:ml-3" />
                                        </div>
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
            {/* Menú de navegación en pantallas grandes */}
            <nav className="hidden lg:flex mr-5">
                <ul className="flex items-center gap-3 text-[1.15rem] font-bold h-full text-n1">
                    <li><Link to='/' className="hover:text-gray-400 duration-300">Inicio</Link></li>
                    <li><Link to='/inventory' className="hover:text-gray-400 duration-300">Inventario</Link></li>
                    <li><Link to='/location' className="hover:text-gray-400 duration-300">Ubicación</Link></li>
                    {localStorage.getItem('AUTH_TOKEN') ? (
                        <li><button type="button" onClick={logout} className="hover:text-gray-400 duration-300">Logout</button></li>
                    ) : (
                        <li><Link to='/login' className="hover:text-gray-400 duration-300">Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
