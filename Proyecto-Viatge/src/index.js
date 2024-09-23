import express from 'express'
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import {join, dirname} from 'path'
import { fileURLToPath } from 'url';
import personasRoutes from './routes/personas.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import actividadesRoutes from './routes/actividades.routes.js'
// Importar el cliente de Apify
import { ApifyClient } from 'apify-client';

//initializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

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
app.get('/', (req, res) => {
    res.render('index')
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
async function BookingScraper() {
    try {
        const actorRun = await client.actor('voyager/booking-scraper').call({
            checkIn: '2024-09-18',
            checkOut: '2024-10-01',
            currency: 'COP',
            language: 'es',
            maxItems: 5,
            minMaxPrice: '0-999999',
            search: 'Colombia',
            sortBy: 'distance_from_search',
            starsCountFilter: 'any'
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
        const scrapedData = await BookingScraper();
        res.json(scrapedData);
    } catch (error) {
        res.status(500).send('Error running task');
    }
});

//run server
app.listen(app.get('port'), ()=>
console.log('El server esta escuchando en el puerto', app.get('port')));