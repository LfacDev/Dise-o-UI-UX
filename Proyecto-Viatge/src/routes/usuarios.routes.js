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

export default router;