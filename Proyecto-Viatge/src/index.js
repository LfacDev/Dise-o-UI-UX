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

//initializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de la sesión
app.use(session({
    secret: 'tu-secreto-aqui', // Cambia esto a un secreto más seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
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
    token: 'apify_api_zQdcXdiP4QYoOtsicWBOsvNjppmaNw3zk9EW', // Sustituye con tu token de Apify
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

        const adultsCount = 1;
        console.log(adultsCount);
        const childrenCount = 1;
        console.log(childrenCount); 
        const roomsCount = 1; 
        console.log(roomsCount);

        // Pasar los parámetros al scraper
        const scrapedData = await BookingScraper(checkIn, checkOut, search, adultsCount, childrenCount, roomsCount);
         // Guardar los resultados en una sesión
        req.session.hotels = scrapedData;

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
    const [pais] = await pool.query('SELECT c.ID_Ciudad, c.Nombre_Ciudad, p.Nombre_Pais FROM ciudad c JOIN pais p ON c.FK_Pais = p.ID_Pais;');
        console.log(pais);
    res.render('personas/listHotel', {showNav: true, showFooter: true, hotels, Hoteles: pais });
});



//run server
app.listen(app.get('port'), ()=>
console.log('El server esta escuchando en el puerto', app.get('port')));