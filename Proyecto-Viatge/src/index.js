import express from 'express'
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import {join, dirname} from 'path'
import { fileURLToPath } from 'url';
import personasRoutes from './routes/personas.routes.js'
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

//public files
app.use(express.static(join(__dirname, 'public')));

// Inicializar el cliente con el token de API
const client = new ApifyClient({
    token: 'apify_api_zQdcXdiP4QYoOtsicWBOsvNjppmaNw3zk9EW', // Sustituye con tu token de Apify
});


// Ejemplo de uso de Apify para ejecutar un actor y obtener datos
async function runApifyTask() {
    try {
        const actorRun = await client.actor('apify/actor-id').call({
            // Puedes pasar parámetros aquí según lo que necesites para tu actor
            input: {
                destination: 'New York',
                checkin: '2024-10-01',
                checkout: '2024-10-05',
                adults: 2,
                rooms: 1,
            },
        });

        console.log('Actor run result:', actorRun);
        
        // Procesa los resultados del actor
        const result = await client.dataset(actorRun.defaultDatasetId).listItems();
        console.log('Scraped data:', result.items);
        
    } catch (error) {
        console.error('Error running Apify task:', error);
    }
}

// Llamar a la función
runApifyTask();

//run server
app.listen(app.get('port'), ()=>
console.log('El server esta escuchando en el puerto', app.get('port')));