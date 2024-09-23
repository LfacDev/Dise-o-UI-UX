import { Router } from "express";
import pool from '../database.js'

const router = Router();

// Ver listado de actividades 
router.get('/buscar_actividades', async(req, res)=>{
        try{
            const [result] = await pool.query(`SELECT a.ID_ActividadTuristica AS IDActividad, a.Nombre_Actividad,  a.Descripcion_Actividad, a.Precio_Actividad, t.Nombre_TipoActividadTur, p.Nombre_Pais, i.URL_ImagenActividad,
            c.Nombre_Ciudad , u.Direccion_Ubicacion, COALESCE(ROUND(AVG(op.Calificacion), 1), 0) AS calificacion, COUNT(op.Comentario) AS Opinion FROM actividad_turistica a 
            LEFT JOIN ubicacion u ON a.FK_Ubicacion = u.ID_Ubicacion
            LEFT JOIN tipo_actividadtur t ON a.FK_TipoActividadTur = t.ID_TipoActividadTur
            LEFT JOIN imagen_actividad i ON a.ID_ActividadTuristica = i.FK_ActividadTuristica
            LEFT JOIN ciudad c ON u.FK_Ciudad = c.ID_Ciudad
            INNER JOIN pais p ON p.ID_Pais = c.FK_Pais
            LEFT JOIN calificaciones op ON op.FK_ActividadTuristica = a.ID_ActividadTuristica 
            GROUP BY a.ID_ActividadTuristica, 
                a.Nombre_Actividad, 
                a.Descripcion_Actividad, 
                a.Precio_Actividad, 
                t.Nombre_TipoActividadTur, 
                p.Nombre_Pais, 
                i.URL_ImagenActividad, 
                c.Nombre_Ciudad, 
                u.Direccion_Ubicacion;`);
            res.render('ActividadesTuristicas/buscar_actividades', {buscarActividad: result});
            console.log(result);
        }catch(err){
            res.status(500).json({message:err.message});
        }
        
    });

/* */
router.get('/ver_actividad/:IDActividad', async(req, res)=>{
    try {
        const {IDActividad} = req.params;
        const[actividad] = await pool.query('Select * from Actividad_Turistica where ID_ActividadTuristica =?',[IDActividad]);
        const verActividad = actividad[0];
        res.render('ActividadesTuristicas/ver_actividad', {actividad: verActividad});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
    
});


export default router;