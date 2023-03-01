const mongoose = require('mongoose');
const Joi = require('joi');

//schema module
const module_schema = new mongoose.Schema({
    module : String,
    note : {
        type: Number,
        default : 0
    }
});


//schema etudiant
const etudiant_schema = new mongoose.Schema({
    nom : String,

    classe : {
        type : String,
        default : "GLSI"
    },

    modules : [module_schema],
    
    moyenne : {
        type: Number,
        default : 0
    }
});

//validation schema for module
const validation_schema_module  = Joi.object({
    module : Joi.string().required(),
    //allwoing 0 to be part of note because positve is > 0
    note : Joi.number().positive().allow(0)
})

//validation schema with joi
const validation_schema_etudiant = Joi.object({
    nom : Joi.string().min(5).max(50).required(),

    classe : Joi.string().required(),

    modules : Joi.array().items(validation_schema_module).required(),
    
    moyenne : Joi.number().positive().allow(0)
});

etudiant_schema.methods.validate_body = (body) => {
    return validation_schema_etudiant.validate(body);
}

const Etudiant = mongoose.model('Etudiant', etudiant_schema);

module.exports.Etudiant = Etudiant;