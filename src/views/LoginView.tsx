import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/UserApi";
import { useForm } from "react-hook-form";
import { LoginForm } from "../types";
import ErrorMessage from "../components/ErrorMessage";
import { useEffect, useState } from "react";

function LoginView() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const initialValues: LoginForm = {
        email: '',
        password: '',
    }

    const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error) => {
            setLoginErrorMessage(error.message);
        },
        onSuccess: () => {
            navigate('/');
        }
    })

    const handleLogin = (formData: LoginForm) => mutate(formData);

    return (
        <div className="relative min-h-[90vh] bg-[url('/img/login.png')] bg-center bg-cover bg-no-repeat bg-opacity-50 py-5">
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="my-[20%] mobile-l:my-[10%] bg-form-bg p-5 mobile-s:p-8 w-[18rem] mobile-s:w-[22rem] mobile-l:w-[25rem]">
                    <h2 className="text-n1 text-4xl font-bold text-center mb-4 mobile-l:mb-8">Login</h2>
                    <form
                        onSubmit={handleSubmit(handleLogin)}
                        noValidate
                    >
                        <div>
                            {loginErrorMessage && (
                                <ErrorMessage>{loginErrorMessage}</ErrorMessage>
                            )}
                            <label className="text-n1 text-xl mobile-l:text-2xl font-bold mt-3" htmlFor="email">Email</label>
                            <div className="flex bg-form-bg p-2 w-full border-b-2 borde-white">
                                <div className="h-full w-6 mr-2 ml-1 flex justify-center items-center"><img className="h-7 w-7 invert" src="/icons/email.svg" alt="Icono" /></div>
                                <input 
                                    className="w-full h-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-l:text-[1.4rem] leading-5" 
                                    type="email" 
                                    id="email" 
                                    autoComplete="email"
                                    {...register("email", {
                                        required: "El Email es obligatorio",
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "E-mail no válido",
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <ErrorMessage>{errors.email.message}</ErrorMessage>
                            )}
                        </div>
                        <div className="mt-3 mobile-l:mt-5">
                            <label className="text-n1 text-xl mobile-l:text-2xl font-bold" htmlFor="password">Password</label>
                            <div className="flex bg-form-bg p-2 w-full border-b-2 borde-white">
                                <div className="h-full w-6 mr-2 ml-1 flex justify-center items-center"><img className="h-7 w-7 invert" src="/icons/password.svg" alt="Icono" /></div>
                                <input 
                                    className="w-full bg-transparent outline-0 text-n1 text-[1.2rem] mobile-l:text-[1.4rem] leading-5" 
                                    type="password" 
                                    id="password" 
                                    autoComplete="current-password"
                                    {...register("password", {
                                        required: "El Password es obligatorio",
                                    })}
                                />
                            </div>
                            {errors.password && (
                                <ErrorMessage>{errors.password.message}</ErrorMessage>
                            )}
                        </div>
                        
                        <input 
                            type="submit" 
                            value="Ingresar"
                            className="w-full mt-6 mobile-l:mt-10 bg-black text-white text-xl p-3 mobile-s:p-4 cursor-pointer hover:bg-custom-green duration-300" 
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginView