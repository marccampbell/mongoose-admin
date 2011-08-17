/**
 * Module dependencies.
 */

var mongoose_admin = require('../')
  , http = require('http')
  , mongoose = require('mongoose')
  , should = require('should');

process.cwd().should.include.string('mongoose-admin');

var modelData = {
    stringField:{type:String},
    dateField:{type:Date}
};

mongoose.connect('mongodb://localhost/mongoose-admin');
var modelSchema = new mongoose.Schema(modelData);
mongoose.model('Model', modelSchema);

var admin = mongoose_admin.createAdmin('mongodb://localhost/mongoose-admin', {port:8001});
admin.registerModel('Model', modelData, {'list':['stringField'], 'sort':['dateField']});

admin.getRegisteredModels(function(err, models) {
    should.not.exist(err);
    models.length.should.eql(1);
    models[0].modelName.should.eql('Model');
    models[0].collection.name.should.eql('models');

    admin.getModel(models[0].collection.name, function(err, model, fields, options) {
        should.not.exist(err);

        admin.close();
        process.exit(0);
    });
});
