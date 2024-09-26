import express from 'express'
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import {join, dirname} from 'path'
import { fileURLToPath } from 'url';
import personasRoutes from './routes/personas.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import actividadesRoutes from './routes/actividades.routes.js'
import pool from './database.js';
// Importar el cliente de Apify
import { ApifyClient } from 'apify-client';
import session from 'express-session';
// Importar para mensajes 


//initializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de la sesión
app.use(session({
    secret: 'mi_secreto',  // Un string para firmar la cookie de sesión
    resave: false,         // Evita guardar la sesión si no hay cambios
    saveUninitialized: true, // Guarda nuevas sesiones no modificadas
    cookie: { maxAge: 3600000 } // Tiempo de vida de la cookie (en este caso 1 hora)
}));


//setting
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname:'.hbs'
}));

app.set('view engine', '.hbs');

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Variables Globales 

//routes
/* app.get('/', (req, res) => {
    res.render('index',{ showNav: true, showFooter: true })
}); */


app.get('/', async(req, res)=>{
    try{
        console.log('entre');
        const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
        console.log(pais);
        res.render('index', {showNav: true, showFooter: true, Hoteles: pais})
    }catch(err){
        console.log("Error:", err.message);
        res.status(500).json({message:err.message});
    }
});


app.use(personasRoutes);
app.use(usuariosRoutes);
app.use(actividadesRoutes);

//public files
app.use(express.static(join(__dirname, 'public')));

//----------------------- API ------------------//


// Inicializar el cliente con el token de API
const client = new ApifyClient({
    token: 'apify_api_hWmuNPR3iBX1oQVov31kvSRcpbEtQN2XPZoL', // Sustituye con tu token de Apify
});


// Ejemplo de uso de Apify para ejecutar un actor y obtener datos
async function BookingScraper(checkIn, checkOut, search, adults, children, rooms) {
    try {
        const actorRun = await client.actor('voyager/booking-scraper').call({
            adults: adults,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            children: children,
            currency: "COP",
            language: "es",
            maxItems: 2,
            minMaxPrice: "0-999999",
            rooms: rooms,
            search: search,
            sortBy: "distance_from_search",
            starsCountFilter: "any"
        });

        const { items } = await client.dataset(actorRun.defaultDatasetId).listItems();
        return items;
    } catch (error) {
        console.error('Error running Booking Scraper:', error);
        throw error;
    }
}

// Configurar la ruta para ejecutar el scraper
app.get('/run-task', async (req, res) => {
    try {
        // Extraer parámetros de la URL
        const { checkIn, checkOut, search, adults, children, rooms} = req.query;

        const childrenCount = parseInt(children);
        const adultsCount = parseInt(adults);
        const roomsCount = parseInt(rooms); 


        // Pasar los parámetros al scraper
        const scrapedData = await BookingScraper(checkIn, checkOut, search, adultsCount, childrenCount, roomsCount);
         // Guardar los resultados en una sesión
        req.session.hotels = scrapedData;
        req.session.reservas = {checkIn, checkOut, search, adultsCount, childrenCount, roomsCount}

         // Redirigir a la vista 'listHotel'
        res.redirect('/personas/listHotel');
        
        console.log(scrapedData);
    } catch (error) {
        console.error('Error running task:', error);  // Mostrar el error en la consola
        res.status(500).send(`Error: ${error.message}`);  // Devolver el mensaje de error como JSON
    }
});

// Ruta para mostrar la lista de hoteles
app.get('/personas/listHotel', async(req, res) => {
    const hotels = req.session.hotels; // Obtener los datos de la sesión
    //simular precios 
    const preciosSimulados = [
        { plataforma: 'Booking', precio: (Math.random() * (150 - 100) + 100).toFixed(2) },
        { plataforma: 'Hotels.com', precio: (Math.random() * (140 - 90) + 90).toFixed(2) },
        { plataforma: 'Priceline', precio: (Math.random() * (160 - 110) + 110).toFixed(2) }
    ];


    console.log(preciosSimulados);
    const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
        console.log(pais);
    res.render('personas/listHotel', {showNav: true, showFooter: true, hotels, Hoteles: pais, preciosSimulados});
});



//Ruta para mostrar las habitaciones del Hotel
app.get('/personas/RoomsHotel', async (req, res) => {
    const hotelId = req.query.id;
    const hotels = req.session.hotels; // Asegúrate de que tienes la lista de hoteles en la sesión
    const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
    console.log(pais);
    

     //simular servicios 
    
    const HotelSeleccionado = hotels.find(hotel => hotel.order == hotelId);
    if (HotelSeleccionado) {
        const [habitacion] = await pool.query('SELECT * FROM viatge_bd.tipo_habitacion;');
        const serviciosSimulados = [
            { categoria: 'Más Populares', servicios: ['Traslado aeropuerto', 'Habitaciones sin humo', 'Adaptado personas de movilidad reducida', 'Parking gratis', 'WiFi gratis', 'Gimnasio', 'Servicio de habitaciones', 'Restaurante', 'Bar', 'Muy buen desayuno'] },
            { categoria: 'Generales', servicios: ['Artículos de aseo gratis', 'Ducha', 'Caja fuerte', 'WC', 'Suelo de madera o parquet', 'Toallas', 'Ropa de cama', 'Enchufe cerca de la cama', 'Escritorio', 'Entrada privada'] },
            { categoria: 'No incluidos', servicios: ['Cámaras de seguridad en la parte exterior de la propiedad', 'TV', 'Lavadora', 'Secadora', 'Aire acondicionado', 'Detector de humo', 'Calefacción'] }
        ];

        res.render('personas/RoomsHotel', {showNav: true, showFooter: true, hotel: HotelSeleccionado, Hoteles: pais, serviciosSimulados, habitaciones: habitacion });
    } else {
        res.status(404).send('Hotel no encontrado');
    }
});

//Reservas
app.get('/personas/Reservas', async (req, res) => {
    const hotelId = req.query.id;
    const hotels = req.session.hotels; // Asegúrate de que tienes la lista de hoteles en la sesión
    const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
    const reservas = req.session.reservas;
    console.log(reservas, 'HOLA');
     //simular servicios 
    
    const HotelSeleccionado = hotels.find(hotel => hotel.order == hotelId);
    const idHotel = req.session.HotelSeleccionado;
    if (HotelSeleccionado) {
        const [habitacion] = await pool.query('SELECT * FROM viatge_bd.tipo_habitacion;');

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
        

        res.render('personas/Reservas', {showNav: true, showFooter: true, hotel: HotelSeleccionado, Hoteles: pais, habitaciones: habitacion, reservas, precioTotal, idHotel });
    } else {
        res.status(404).send('Hotel no encontrado');
    }
});





//run server
app.listen(app.get('port'), ()=>
console.log('El server esta escuchando en el puerto', app.get('port')));