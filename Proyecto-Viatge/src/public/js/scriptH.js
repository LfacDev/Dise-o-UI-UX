const ciudadH = document.getElementById('dropdownBuscarH');
const dropContenidoH = document.getElementById('dropContenidoH');

    //DROPDOWN

// Filtrar países
ciudad.addEventListener('input', () => {
    //no distingue de mayus o minusc
    const filtrarH = ciudadH.value.toLowerCase();
    //obtiene los datos del span
    const datosH = dropContenidoH.getElementsByTagName('span');

    //recorre los datos hasta qie encuentre la palabra que puso el usuario
    for (let i = 0; i < datosH.length; i++) {
        const nombreCiudadH = datosH[i].textContent.toLowerCase();
        //aqui hace la validacion de las palabras
        datos[i].style.display = nombreCiudadH.includes(filtrar) ? '' : 'none';
    }
});

// Actualizar el input con la ciudad seleccionada
const datosH = dropContenidoH.getElementsByTagName('span');
//como tenemos varios datos toca recorrerlos
for (let i = 0; i < datosH.length; i++) {
    datosH[i].addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto
        ciudadH.value = event.target.textContent; // Actualiza el input con el nombre de la ciudad
        dropContenidoH.style.display = 'none'; // Cierra el dropdown
    });
}

// Mostrar el dropdown al enfocar el input
ciudadH.addEventListener('focus', () => {
    dropContenidoH.style.display = 'block';
});

// Cerrar el dropdown al hacer clic fuera de él
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
        dropContenidoH.style.display = 'none';
    }
});