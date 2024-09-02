import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom"

function Footer() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logout = () => {
        localStorage.removeItem('AUTH_TOKEN');
        queryClient.removeQueries({ queryKey: ['user'] });
        navigate('/login');
    };

    return (
        <footer className="bg-black flex flex-col items-center pt-3 pb-6 gap-7">
            <nav>
                <ul className="flex flex-col mobile-m:flex-row items-center gap-0  mobile-m:gap-3 text-[1.25rem] font-bold h-full text-n1">
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
            <div className="flex items-center gap-1">
                <img className="invert w-6 h-6" src="/icons/laptop-code.svg" alt="Icono Laptop-code" />
                <p className="text-n1 text-lg">Developed by William Medina</p>
            </div>
            
        </footer>
    )
}

export default Footer