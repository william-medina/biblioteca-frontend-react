
function ErrorMessage({children} : {children: React.ReactNode}) {
    return (
        <div className="text-center mt-2 bg-[#ff000066] text-white border-2 border-white font-bold p-2 uppercase text-[0.65rem] mobile-l:text-xs">
            {children}
        </div>
    )
}

export default ErrorMessage