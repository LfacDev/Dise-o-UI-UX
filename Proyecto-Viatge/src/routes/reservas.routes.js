import { Router } from "express";
import pool from '../database.js'

const router = Router();

router.get('/listHotel', (req, res) => {
    res.render('personas/listHotel', { showNav: true, showFooter: true }); // Asegúrate de que 'listHotel' es el nombre correcto de tu archivo HBS
});

router.get('/personas/test', (req, res) => {
    res.render('personas/test', { showNav: true, showFooter: true }); // Asegúrate de que 'listHotel' es el nombre correcto de tu archivo HBS
});


router.get('/personas/listHotel', async(req, res) => {
    const hotels = req.session.hotels; // Obtener los datos de la sesión
    //simular precios 
    const preciosSimulados = [
        { plataforma: 'Booking', precio: (Math.random() * (150 - 100) + 100).toFixed(3) },
        { plataforma: 'Hotels.com', precio: (Math.random() * (140 - 90) + 90).toFixed(3) },
        { plataforma: 'Priceline', precio: (Math.random() * (160 - 110) + 110).toFixed(3) }
    ];


    console.log(preciosSimulados);
    const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
        console.log(pais);
    res.render('personas/listHotel', {showNav: true, showFooter: true, hotels, Hoteles: pais, preciosSimulados});
});

router.get('/personas/RoomsHotel', async (req, res) => {
    const hotelId = req.query.id;
    const hotels = req.session.hotels; // Asegúrate de que tienes la lista de hoteles en la sesión
    const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
    const [paises] = await pool.query('SELECT * from pais');
    console.log(pais);
    
    
    const HotelSeleccionado = hotels.find(hotel => hotel.order == hotelId);
    const CiudadSeleccionado = pais.find(pais => pais.Nombre_Pais == HotelSeleccionado.address.country);
    const PaisSeleccionado = paises.find(paises => paises.Nombre_Pais == HotelSeleccionado.address.country);
    
/*     console.log("---------");
    console.log(HotelSeleccionado);
    console.log(PaisSeleccionado);
    console.log(HotelSeleccionado.name);
    console.log(HotelSeleccionado.address.street);
    console.log(HotelSeleccionado.address.country);
    console.log(HotelSeleccionado.location.lat, HotelSeleccionado.location.lng);
    console.log(CiudadSeleccionado.ID_Ciudad);
    console.log(PaisSeleccionado.ID_Pais); */


const nombreHotel = HotelSeleccionado.name;
const direccion = HotelSeleccionado.address.street;
const latitud = HotelSeleccionado.location.lat;
const longitud = HotelSeleccionado.location.lng;
const idCiudad = CiudadSeleccionado.ID_Ciudad; // Ya extraído antes
const idPais = PaisSeleccionado.ID_Pais; // Ya extraído antes

// Insertar la ubicación en la tabla Ubicacion
await pool.query('INSERT INTO Ubicacion (Direccion_Ubicacion, Latitud_Ubicacion, Longitud_Ubicacion, FK_Ciudad) VALUES (?, ?, ?, ?)', 
    [direccion, latitud, longitud, idCiudad]);

// Obtener el ID de la ubicación recién insertada
const [resultadoUbicacion] = await pool.query('SELECT LAST_INSERT_ID() as ID_Ubicacion');
const idUbicacion = resultadoUbicacion[0].ID_Ubicacion;

// Ahora puedes usar el `idUbicacion` para insertar el hotel en la tabla Hotel
await pool.query('INSERT INTO Hotel (Nombre_Hotel, Descripcion_Hotel, Imagen_Hotel, FK_TipoHotel, FK_Ubicacion) VALUES (?, ?, ?, ?, ?)', 
    [nombreHotel, nombreHotel, 'ruta/a/la/imagen.jpg', 1, idUbicacion]);

    if (HotelSeleccionado) {
        const [habitacion] = await pool.query('SELECT * FROM viatge_bd.tipo_habitacion;');

        const serviciosSimulados = [
            { categoria: 'Más Populares', servicios: ['Traslado aeropuerto', 'Habitaciones sin humo', 'Adaptado personas de movilidad reducida', 'Parking gratis', 'WiFi gratis', 'Gimnasio', 'Servicio de habitaciones', 'Restaurante', 'Bar', 'Muy buen desayuno'] },
            { categoria: 'Generales', servicios: ['Artículos de aseo gratis', 'Ducha', 'Caja fuerte', 'WC', 'Suelo de madera o parquet', 'Toallas', 'Ropa de cama', 'Enchufe cerca de la cama', 'Escritorio', 'Entrada privada'] },
            { categoria: 'No incluidos', servicios: ['Cámaras de seguridad en la parte exterior de la propiedad', 'TV', 'Lavadora', 'Secadora', 'Aire acondicionado', 'Detector de humo', 'Calefacción'] }
        ];
        console.log("*********");
        console.log(pais);

        res.render('personas/RoomsHotel', {showNav: true, showFooter: true, hotel: HotelSeleccionado, Hoteles: pais, serviciosSimulados, habitaciones: habitacion });
    } else {
        res.status(404).send('Hotel no encontrado');
    }
});

router.get('/personas/Reservas', async (req, res) => {
    const hotelId = req.query.id;
    const hotels = req.session.hotels; // Asegúrate de que tienes la lista de hoteles en la sesión
    const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
    const [HotelR] = await pool.query('SELECT * from hotel;');
    const reservas = req.session.reservas;

    console.log(reservas, 'HOLA');
     //simular servicios 
    
    const HotelSeleccionado = hotels.find(hotel => hotel.order == hotelId);
    
    
    const idHotel = req.session.HotelSeleccionado;
    if (HotelSeleccionado) {
        const [habitacion] = await pool.query('SELECT * FROM viatge_bd.tipo_habitacion;');
        const HotelidBD = HotelR.find(HotelR => HotelR.Nombre_Hotel == HotelSeleccionado.name);
        const ID_Hotel = HotelidBD.ID_Hotel;
        // Cálculo de precios
        const precioPorHabitacion = 100.000; // Ejemplo de precio por habitación
        const precioPorAdulto = 50.000;      // Ejemplo de precio por adulto
        const precioPorNino = 25.000;        // Ejemplo de precio por niño

        // Accediendo a los datos de reservas
        const cantidadHabitaciones = reservas.roomsCount; // Por defecto 1 si no está definido
        const cantidadAdultos = reservas.adultsCount;
        const cantidadNinos = reservas.childrenCount;

        console.log(cantidadHabitaciones, cantidadAdultos, cantidadNinos);

        // Calcula el precio total
        const precioTotal = (cantidadHabitaciones * precioPorHabitacion) + (cantidadAdultos * precioPorAdulto) + (cantidadNinos * precioPorNino);
        
        const entradaR = reservas.checkIn;
        const salidaR = reservas.checkOut;
        const precioR = reservas.precioTotal;

        await pool.query('INSERT INTO reserva_hotel (Fechallegada, FechaSalida, TotalPagar_Hotel, FK_Hotel, FK_Huesped, FK_Usuario, FK_TipoPago) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [entradaR, salidaR, precioR , ID_Hotel, 1, 1, 1]);

        res.render('personas/Reservas', {showNav: true, showFooter: true, hotel: HotelSeleccionado, Hoteles: pais, habitaciones: habitacion, reservas, precioTotal, idHotel });
    } else {
        res.status(404).send('Hotel no encontrado');
    }
});




/* router.get('/index', async(req, res)=>{
    try{
        console.log('entre');
        const [pais] = await pool.query('SELECT ID_Pais, Nombre_Pais FROM pais');
        console.log(pais);
        res.render('index', {showNav: true, showFooter: true, Hoteles: pais})
    }catch(err){
        console.log("Error:", err.message);
        res.status(500).json({message:err.message});
    }
}); */

/* router.get('/add', (req, res)=>{
    res.render('personas/add', { showNav: true, showFooter: true });
}); */


export default router;