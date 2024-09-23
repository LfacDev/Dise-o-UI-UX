import { Router } from "express";
import pool from '../database.js'

const router = Router();

router.get('/login', (req, res) => {
    res.render('personas/login', { showNav: false, showFooter: false });
});


router.get('/register', (req, res) => {
    res.render('personas/register', { showNav: false, showFooter: false });
});

router.get('/listHotel', (req, res) => {
    res.render('personas/listHotel', { showNav: true, showFooter: true }); // Asegúrate de que 'listHotel' es el nombre correcto de tu archivo HBS
});



/* router.get('/index', async(req, res)=>{
    try{
        console.log('entre');
        const [pais] = await pool.query('SELECT ID_Pais, Nombre_Pais FROM pais');
        console.log(pais);
        res.render('index', {showNav: true, showFooter: true, Hoteles: pais})
    }catch(err){
        console.log("Error:", err.message);
        res.status(500).json({message:err.message});
    }
}); */

/* router.get('/add', (req, res)=>{
    res.render('personas/add', { showNav: true, showFooter: true });
}); */

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
        res.render('personas/list', {showNav: true, showFooter: true, personas: result})
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.get('/edit/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const[Hoteles] = await pool.query('SELECT ID_Pais, Nombre_Pais FROM pais WHERE ID_Pais= ?', [id]);
        const personaEdit = Hoteles[0];

        res.render('personas/edit', {Hoteles: Hoteles});
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