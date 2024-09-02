import Swal from 'sweetalert2';

export const showSuccessAlert = (string: string) => {
    Swal.fire({
        html: `
            <div class="showSuccessAlert">
                <h3>${string}</h3>
            </div>
        `,
        icon: 'success',
        background: 'rgba(0, 0, 0, 0.8)',
        backdrop: true,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        width: 'auto',  
    });
};


export const showDeleteConfirmation = async (): Promise<boolean> => {
    const result = await Swal.fire({
        html: `
            <div class="showSuccessAlert">
                <h3>
                    ¿Deseas eliminar <br> este libro?
                </h3>
            </div>
        `,
        icon: 'warning',
        background: 'rgba(0, 0, 0, 0.85)', 
        backdrop: 'rgba(0, 0, 0, 0.5)', 
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: 'Eliminar',
        confirmButtonColor: '#ff0000cc', 
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#333', 
        focusCancel: true,
        allowOutsideClick: true, 
        allowEscapeKey: true, 
        customClass: {
            confirmButton: 'swal-custom-button',
            cancelButton: 'swal-custom-button',
        },
        //scrollbarPadding: false
    });

    return result.isConfirmed;
};

export const closeAllSwalAlerts = () => {
    Swal.close();
};
