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
            res.render('ActividadesTuristicas/buscar_actividades', {showNav: true, showFooter: true,buscarActividad: result});
            console.log(result);
        }catch(err){
            res.status(500).json({message:err.message});
        }
        
    });

/* */
router.get('/ver_actividad/:IDActividad', async(req, res)=>{
    try {
        const {IDActividad} = req.params;
        const[actividad] = await pool.query(`SELECT 
    d.FK_ActividadTuristica,
	a.ID_ActividadTuristica,
    a.Nombre_Actividad,  
    a.Descripcion_Actividad, 
    a.Precio_Actividad, 
    a.Descripcion_Mini,
    f.año,
    f.mes,
    f.dia,
    f.hora,
    d.Disponible,
    t.Nombre_TipoActividadTur, 
    p.Nombre_Pais, 
    i.URL_ImagenActividad,
    c.Nombre_Ciudad, 
    u.Direccion_Ubicacion, 
    op.Comentario,
    COALESCE(ROUND(AVG(op.Calificacion), 1), 0) AS Calificacion, 
    COUNT(op.Comentario) AS Cantidad_Opinion,  
    a.EsFavorito 
    FROM actividad_turistica a 
    LEFT JOIN ubicacion u ON a.FK_Ubicacion = u.ID_Ubicacion
    LEFT JOIN tipo_actividadtur t ON a.FK_TipoActividadTur = t.ID_TipoActividadTur
    LEFT JOIN imagen_actividad i ON a.ID_ActividadTuristica = i.FK_ActividadTuristica
    LEFT JOIN ciudad c ON u.FK_Ciudad = c.ID_Ciudad
    LEFT JOIN pais p ON p.ID_Pais = c.FK_Pais
    LEFT JOIN calificaciones op ON a.ID_ActividadTuristica  = op.FK_ActividadTuristica 
    LEFT JOIN disponibilidad_Actividad d ON a.ID_ActividadTuristica = d.FK_ActividadTuristica
    LEFT JOIN fechas_disponibles f ON d.FK_FechaDisp = f.ID_FechaDisp
    WHERE a.ID_ActividadTuristica = ?
    GROUP BY 
    d.FK_ActividadTuristica,
    a.ID_ActividadTuristica, 
    a.Nombre_Actividad, 
    a.Descripcion_Actividad, 
    a.Precio_Actividad, 
    t.Nombre_TipoActividadTur, 
    p.Nombre_Pais, 
    i.URL_ImagenActividad, 
    c.Nombre_Ciudad, 
    u.Direccion_Ubicacion,
    a.EsFavorito,
    f.año,
    f.mes,
    f.dia,
    f.hora,
    op.Comentario,
    d.Disponible;`,[IDActividad]);
        const verActividad = actividad[0];
        const [fechas] = await pool.query('call VerDispoibilidadActividad(?)', [IDActividad]);    

        res.render('ActividadesTuristicas/ver_actividad', {showNav:true, showFooter:true, actividad: verActividad, fechas});
        console.log(actividad);
        console.log(fechas);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});

//Cambio de estado favorito
router.post('/cambioFavorito/:IDActividad', async(req, res)=>{
    try {
        const {IDActividad} = req.params;
        const [actividad] = await pool.query(`SELECT ID_ActividadTuristica, EsFavorito FROM actividad_turistica WHERE ID_ActividadTuristica = ?`, [IDActividad]);
        
        if (actividad.length > 0) {
            const nuevoEstado = !actividad[0].EsFavorito; // Cambia el estado
            await pool.query(`UPDATE actividad_turistica SET EsFavorito = ? WHERE ID_ActividadTuristica = ?`, [nuevoEstado, IDActividad]);
        }
        res.redirect(`/ver_actividad/${IDActividad}`);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});




export default router;