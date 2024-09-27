import { Router } from "express";
import pool from '../database.js'

const router = Router();

router.get('/favoritos', async(req, res)=>{
    try {
        const[favoritos] = await pool.query('call ObtenerActividadesFavoritas()');
        const verFavorito = favoritos[0];    
        res.render('ActividadesTuristicas/ver_favoritos', {showNav:true, showFooter:true, favoritos: verFavorito});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});


router.post('/Favoritocambia/:IDActividad', async(req, res)=>{
    try {
        const {IDActividad} = req.params;
        const [actividad] = await pool.query(`SELECT ID_ActividadTuristica, EsFavorito FROM actividad_turistica WHERE ID_ActividadTuristica = ?`, [IDActividad]);
        
        if (actividad.length > 0) {
            const nuevoEstado = !actividad[0].EsFavorito; // Cambia el estado
            await pool.query(`UPDATE actividad_turistica SET EsFavorito = ? WHERE ID_ActividadTuristica = ?`, [nuevoEstado, IDActividad]);
        }
        res.redirect(`/favoritos`);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});


export default router;