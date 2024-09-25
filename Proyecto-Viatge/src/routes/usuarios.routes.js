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
router.post('/registrar_usuario', async(req, res)=>{
    
    try{
        const {Correo_Usuario, Contrasena} = req.body;
        await pool.query('INSERT INTO Usuario (Correo_Usuario, Contrasena) VALUES  (?, ? )', [Correo_Usuario, Contrasena]);
        res.redirect('/login');
    }catch(err){
        res.status(500).json({message:err.message});
    }
});
export default router;