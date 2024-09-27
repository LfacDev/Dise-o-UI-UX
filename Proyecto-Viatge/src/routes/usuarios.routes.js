import { Router } from "express";
import pool from '../database.js'

const router = Router();

// Visualizar login
router.get('/login', (req, res)=>{
    res.render('usuarios/login');
    console.log('en login');
});

// Visualizar registro
router.get('/registro', (req, res)=>{
    res.render('usuarios/registro');
});

//Registrar Usuario
router.post('/registro', async(req, res)=>{
    
    try{
        const {Correo_Usuario, Contrasena} = req.body;
        await pool.query('INSERT INTO Usuario (Correo_Usuario, Contrasena) VALUES  (?, ? )', [Correo_Usuario, Contrasena]);
        res.redirect('/login');
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.post('/login', async(req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Realizar la consulta a la base de datos
        const query = 'SELECT * FROM usuario WHERE Correo_Usuario = ?';
        const results = await pool.query(query, [usuario]);

        // Verificar si el usuario existe
        if (results.length === 0) {
            return res.status(401).send('Usuario no encontrado');
        }

        const user = results[0];

        // Comparar la contraseña ingresada con la almacenada
        if (contrasena === user.contrasena) {
            req.session.user = user; // Guardar el usuario en la sesión
            return res.redirect('/'); // Redirige a la página principal después de iniciar sesión
        }

        res.status(401).send('Contraseña incorrecta');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});



export default router;