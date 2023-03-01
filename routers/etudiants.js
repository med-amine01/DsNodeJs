const router = require('express').Router();
const mongoose = require('mongoose');
const {Etudiant} = require('../models/etudiant');
const _ = require('lodash');

//ALL STUDENTS MOYENNE ENDPOINT
router.get('/moygeneral', async(req,res) => {
    let etudiants = await Etudiant.find();

    //checking if there is no student
    if(etudiants.length == 0){
        return res.status(404).send("NO STUDENT FOUND");
    }

    let sum = 0 ;
    etudiants.forEach(et => {
        sum+= et.moyenne;
    });

    let moy = (sum/etudiants.length).toFixed(2);

    return res.status(200).send(JSON.stringify(moy));
});


//MIN MAX NOTE ENDPOINT
router.get('/min_max', async(req, res) => {
    let etudiants = await Etudiant.find();

    //checking if there is no student
    if(etudiants.length == 0){
        return res.status(404).send("NO STUDENT FOUND");
    }

    //we will push the result in this array
    let arrayEtudiants = [];

    // for each student 
    etudiants.forEach(element => {
        let arrayNotes = [];

        //extracting his notes and push it inside array
        element.modules.forEach(mod => {
            arrayNotes.push(mod.note);
        });

        //foreach student assign an object with nom, min, max inside arrayEtudiants
        arrayEtudiants.push({
            nom : element.nom,
            min : Math.min(...arrayNotes),
            max : Math.max(...arrayNotes)
        })
    });
    return res.status(200).send(arrayEtudiants);
});

//ADD ENDPOINT
router.post('/add', async (req,res) => {
    let etudiant = new Etudiant(req.body);
    //validation from schema
    let validation_res = etudiant.validate_body(req.body);
    //testing if there is any validation error
    if(validation_res.error){
        return res.status(400).send(validation_res.error.message);
    }

    try {

        let sum = 0;
        etudiant.modules.forEach(element => {
            sum += element.note;
        });
        
        etudiant.moyenne = (sum / etudiant.modules.length).toFixed(2);
        etudiant = await etudiant.save();
    } 
    catch (error) {
        return res.status(400).send(error.message);
    }
    res.status(201).send(etudiant);
});

//GET ALL ENDPOINT
router.get('/getall', async (req,res) => {
    let etudiants = await Etudiant.find();
    return res.status(200).send(etudiants);
});

//GET BY ID ENDPOINT
router.get('/get/:id', async (req, res) => {
    //validate id format
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send("WRONG ID");
    }

    let etudiant = await Etudiant.findById(req.params.id);
    //object is null
    if(!etudiant){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    res.status(200).send(etudiant);
});

//DELETE ENDPOINT
router.delete('/delete/:id', async (req, res) => {
    //validate id format
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send("WRONG ID");
    }

    let etudiant = await Etudiant.findByIdAndRemove(req.params.id);
    //object is null
    if(!etudiant){
        return res.status(404).send("STUDENT NOT FOUND");
    }
    res.status(200).send(etudiant);
});

router.put('/update/:id',async (req, res) =>{
    //validate id format
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send("WRONG ID");
    }

    let etudiant = await Etudiant.findById(req.params.id);
    //object is null
    if(!etudiant){
        return res.status(404).send("STUDENT NOT FOUND");
    }

    //validation the new request body 
    //because the old onces are already inside db and validated
    let validation_res = etudiant.validate_body(req.body);
    //testing if there is any validation error
    if(validation_res.error){
        return res.status(400).send(validation_res.error.message);
    }


    try {

        let sum = 0;
        etudiant.modules.forEach(element => {
            sum += element.note;
        });
        
        etudiant.moyenne = (sum / etudiant.modules.length).toFixed(2);
        //using _ (lodash) to merge the given body object + the founded object
        etudiant = _.merge(etudiant,req.body);
        await etudiant.save();
    } 
    catch (error) {
        return res.status(400).send(error.message);
    }
    
    res.status(200).send(etudiant);
});

module.exports = router;