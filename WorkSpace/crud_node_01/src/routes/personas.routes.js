import { Router } from "express";
import pool from '../database.js'

const router = Router();

router.get('/add', (req, res)=>{
    res.render('personas/add');
});

router.post('/add', async(req, res)=>{
    
    try{
        const {name,lastname, age, FK_tipopersona} = req.body;
        const newPersona = {
            name, lastname, age, FK_tipopersona
        }
        await pool.query('INSERT INTO personas SET ? ', [newPersona]);
        res.redirect('/list');
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/list', async(req, res)=>{
    try{
        const [result] = await pool.query('SELECT personas.id ,personas.name, personas.lastname,personas.age, tipopersona.Nombre FROM personas INNER JOIN tipopersona on tipopersona.ID = personas.FK_tipopersona');
        res.render('personas/list', {personas: result})
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/edit/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const[persona] = await pool.query('SELECT personas.id ,personas.name, personas.lastname,personas.age, tipopersona.Nombre FROM personas INNER JOIN tipopersona on tipopersona.ID = personas.FK_tipopersona WHERE personas.id= ?', [id]);
        const personaEdit = persona[0];
        res.render('personas/edit', {persona: personaEdit});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.post('/edit/:id', async(req, res)=>{
    try {
        const {name, lastname, age, FK_tipopersona} = req.body;
        const {id} = req.params;
        const editPersona = {name, lastname, age, FK_tipopersona};
        await pool.query('UPDATE personas SET ? WHERE ID = ?', [editPersona, id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

router.get('/delete/:id', async(req, res)=>{
    try {
        const{id} = req.params;
        await pool.query('DELETE FROM personas WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});

export default router;