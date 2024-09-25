
//variables
//CALENDARIO
let abrirModal = document.getElementById("abrir-modal");
let modal = document.getElementById("calendarModal");
const fechaActual = new Date();
let mesActual = fechaActual.getMonth();
let añoActual = fechaActual.getFullYear();
let fechaInicio = null;
let fechafin = null;

//DROPDOWN
const ciudad = document.getElementById('dropdownBuscar');
const dropContenido = document.getElementById('dropContenido');

//HUESPED/HABITACIONES
let abrirHuesped = document.getElementById("abrir-huesped");
let huespedModal = document.getElementById("huespedModal");
let menos = document.getElementById('menos');
let mas = document.getElementById('mas');
let cantidad = document.getElementById('cantidad');
let menos1 = document.getElementById('menos1');
let mas1 = document.getElementById('mas1');
let cantidad1 = document.getElementById('cantidad1');
let menos2 = document.getElementById('menos2');
let mas2 = document.getElementById('mas2');
let cantidad2 = document.getElementById('cantidad2');
let contador = null;
let contador1 = null;
let contador2 = null;
let huesped = document.querySelectorAll('huesped');
let huespedHabitacion = document.getElementById('huesped/habitacion');

//DOM
//CALENDARIO
const calenBody = document.getElementById('calenBody');
const mesActualElemento = document.getElementById('mesActual');
const llegada = document.getElementById('llegada');
const salida = document.getElementById('salida');

const prevBtn = document.getElementById('prevbtn');
const nextBtn = document.getElementById('nextbtn');


//MODAL 

//CALENDARIO
abrirModal.addEventListener("click", function(){
    modal.style.display = "block";
});

window.addEventListener("click",function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
});


//botones para mostrar mes siguiente o mes anterior 
prevBtn.addEventListener('click', ()=>{
    mesActual--;
    renderCalen();
});

nextBtn.addEventListener('click', ()=>{
    mesActual++;
    renderCalen();
});


//creacion del calendario
function renderCalen(){


    //calcular dias del mes
    //creamos una nueva fecha con el año añoActual, el mes mesActual + 1 (el siguiente mes), y el día 0
    //si le das el valor 0 como día, te devuelve el último día del mes anterior. Entonces, al poner mesActual + 1, 0, estás obteniendo el último día del mes mesActual
    const diasDelMes = new Date(añoActual, mesActual + 1, 0).getDate();
    //primer dia del mes
    const primerDia = new Date(añoActual, mesActual, 1).getDay();

    //pasamos el texto
    //nos da la fecha en una cadena de texto(localdatestring)
    //y lo mapea mostrando el mes completo y el año con los 4 numeros
    mesActualElemento.textContent = new Date(añoActual, mesActual).toLocaleDateString('default',{month:'long', year:'numeric'});


    //añade casillas vacías para alinear el primer día del mes con el día de la semana correcto.
    let dias = '';
    for (let i = 0; i < primerDia; i++) {
        dias+= `<div class="calendarDay"></div>`
    }

    //Este bucle genera los días del mes
    for (let i = 1; i <= diasDelMes; i++) {
        //aqui se obtiene el año, la fecha y el dia del mes
        const fecha = new Date(añoActual, mesActual, i);
        //lamamos a la funcion
        const NombreClass = getDiaClass(fecha);
        //aqui creamos los dias con una clase especifica dependiendo de la funcion
        dias+=`<div class="calenDay ${NombreClass}" onclick="seleccionarDia(${i})">${i}</div>`;
    }

    calenBody.innerHTML = dias;

}

//Actualiza las variables dependiendo de la seleccion 
// se crea una nueva fecha basada en la seleccion
    function seleccionarDia(dia){

        const clickFecha = new Date(añoActual, mesActual, dia);
        //si tengo fechainicio-fechafin en un rango y hago otra seleccion, la nueva seleccion sera fechainicio y vaciaremos fechafin
        if(!fechaInicio || fechafin){
            fechaInicio = clickFecha;
            fechafin = null;
        }else if(clickFecha < fechaInicio){
            //si la nueva seleccion es menor a la fechainicio, se convertira en fechainicio
            fechaInicio = clickFecha;
        }else if(clickFecha > fechaInicio){
            //si la seleccion es mayor a fechainicio esta sera el nuevo valor de fechafin
            fechafin = clickFecha;
        }

        renderCalen();
        actualizarFechas();
    }

    //aqui mostraremos la fechas seleccionadas
    function actualizarFechas(){
        if(fechaInicio && fechafin){
            llegada.textContent = `${formatearFecha(fechaInicio)}`;
            salida.textContent = `${formatearFecha(fechafin)}`;
        } else if (fechaInicio){
            llegada.textContent = `${formatearFecha(fechaInicio)}`;
            salida.textContent = `Agregar Fecha`;
        } else {
            llegada.textContent = `Agregar Fecha`;
            salida.textContent = `Agregar Fecha`;
        }
    } 

    //aqui brindaremos las clases dependiendo de la seleccion
    //si la seleccion es igual a fecha inicio y fecha fin obtiene selected
    //si esta entre esas fechas obtiene la clase range
    function getDiaClass(fecha){
        if (fechaInicio && fecha.toDateString() === fechaInicio.toDateString()){
            return 'selected';
        }
        if (fechafin && fecha.toDateString() === fechafin.toDateString()){
            return 'selected';
        }
        if (fechaInicio && fechafin && fecha > fechaInicio && fecha < fechafin){
            return 'range';
        }
        return '';
    }

    function formatearFecha(fecha) {
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Asegura que el mes tenga dos dígitos
        const day = fecha.getDate().toString().padStart(2, '0'); // Asegura que el día tenga dos dígitos
    
        return `${year}-${month}-${day}`;
    }

    renderCalen();
    actualizarFechas();



    //DROPDOWN

// Filtrar países
ciudad.addEventListener('input', () => {
    //no distingue de mayus o minusc
    const filtrar = ciudad.value.toLowerCase();
    //obtiene los datos del span
    const datos = dropContenido.getElementsByTagName('span');

    //recorre los datos hasta qie encuentre la palabra que puso el usuario
    for (let i = 0; i < datos.length; i++) {
        const nombreCiudad = datos[i].textContent.toLowerCase();
        //aqui hace la validacion de las palabras
        datos[i].style.display = nombreCiudad.includes(filtrar) ? '' : 'none';
    }
});

// Actualizar el input con la ciudad seleccionada
const datos = dropContenido.getElementsByTagName('span');
//como tenemos varios datos toca recorrerlos
for (let i = 0; i < datos.length; i++) {
    datos[i].addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto
        ciudad.value = event.target.textContent; // Actualiza el input con el nombre de la ciudad
        dropContenido.style.display = 'none'; // Cierra el dropdown
    });
}

// Mostrar el dropdown al enfocar el input
ciudad.addEventListener('focus', () => {
    dropContenido.style.display = 'block';
});

// Cerrar el dropdown al hacer clic fuera de él
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
        dropContenido.style.display = 'none';
    }
});



/* MODAL HUESPED/HABITACIONES */

abrirHuesped.addEventListener("click", function(){
    huespedModal.style.display = "block";
});

window.addEventListener("click",function(event) {
    if (event.target == huespedModal) {
        huespedModal.style.display = "none";
    }
  });

function actualizarHuesped(){
    
    if(contador && contador1 && contador2){
        huespedHabitacion.textContent = `${contador + contador1} Huespedes, ${contador2} Habitaciones`;
    } else {
        huespedHabitacion.textContent = `1 Huespedes, 1 Habitacion`;
    }
} 

menos.addEventListener('click', ()=>{
    if (contador > 1){
        contador--; 
        cantidad.textContent = contador; 
        actualizarHuesped();
    }else if (contador === 1){
        menos.style.visibility = false;
        cantidad.textContent = contador;
        actualizarHuesped();
    }
    
})  

mas.addEventListener('click', ()=>{
    contador++; 
    cantidad.textContent = contador;
    actualizarHuesped();
})  

menos1.addEventListener('click', ()=>{
    if (contador1 > 1){
        contador1--; 
        cantidad1.textContent = contador1; 
        actualizarHuesped();
    }else if (contador1 === 1){
        menos1.style.visibility = false;
        cantidad1.textContent = contador1;
        actualizarHuesped();
    }
    
})  

mas1.addEventListener('click', ()=>{
    contador1++; 
    cantidad1.textContent = contador1;
    actualizarHuesped();
})  

menos2.addEventListener('click', ()=>{
    if (contador2 > 1){
        contador2--; 
        cantidad2.textContent = contador2; 
        actualizarHuesped();
    }else if (contador2 === 1){
        menos2.style.visibility = false;
        cantidad2.textContent = contador2;
        actualizarHuesped();
    }
    
})  

mas2.addEventListener('click', ()=>{
    contador2++; 
    cantidad2.textContent = contador2;
    actualizarHuesped();
})  



/* PASAR DATOS A INDEX.JS PARA PASARLOS A LA API */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-buscar').addEventListener('click', async () => {
        const fechaLlegada = formatearFecha(new Date(fechaInicio)) ;
        const fechaSalida = formatearFecha(new Date(fechafin));
        console.log(fechaLlegada);
        console.log(fechaSalida);
        
        // Obtener el valor del input y dividir ciudad y país
        const valorInput = ciudad.value; 
        const nombreCiudad = valorInput.split(',')[0].trim(); // Solo la ciudad
        console.log(nombreCiudad);
        

        const adultos = parseInt(contador);
        const niños = parseInt(contador1); 
        const cantidadHabitaciones = parseInt(contador2);
        console.log(cantidadHabitaciones);
        
        window.location.href = `/run-task?checkIn=${fechaLlegada}&checkOut=${fechaSalida}&search=${nombreCiudad}&adults=${adultos}&children=${niños}&rooms=${cantidadHabitaciones}`;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    let map = L.map('miMapa').setView([4.631826, -74.080483], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Obtiene todas las latitudes y longitudes
    let latitudes = document.getElementsByClassName('ubi_latitud');
    let longitudes = document.getElementsByClassName('ubi_longitud');
    let imagen = document.getElementsByClassName('img-hotel');
    let nombre = document.getElementsByClassName('nom-hotel');

    // Itera sobre las latitudes y longitudes para crear marcadores
    for (let i = 0; i < latitudes.length; i++) {
        let latitud = latitudes[i].textContent;
        let longitud = longitudes[i].textContent;
        let img = imagen[i].src;
        let nom = nombre[i].textContent 

        // Agregar un marcador en el mapa
        L.marker([latitud, longitud]).addTo(map)
            .bindPopup(`
                <div style="text-align: center; border-radius: 15px; background-color: #A5D9E5;">
                    <img src="${img}" alt="Imagen del hotel" style="width: 100px; height: 100px; border-radius: 15px;">
                    <p><strong>${nom}</strong></p>
                </div>
            `)
            .openPopup();
    }
});












