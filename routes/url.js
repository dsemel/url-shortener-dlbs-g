var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validUrl = require('valid-url');

function urlValidator(v){

    return validUrl.isUri(v);
};

var urlSchema = new mongoose.Schema({

    long_url: { type: String, validate: [urlValidator, 'error']},
    short_id:{ type: String, required: true},

});

var UrlB = mongoose.model('UrlB', urlSchema);

module.exports = UrlB;

