import  Swal  from 'sweetalert2';

export const AlertSuccess = ({title, text}) => {

    Swal.fire({
        title: title,
        text: text,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });
}

export const AlertError = ({title, text}) => {

    Swal.fire({
        title: title,
        text: text,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
}

export const AlertWarning = ({title, text}) => {
    
    Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
      });
}
