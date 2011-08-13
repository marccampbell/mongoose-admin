/**
 * Module dependencies.
 */

var mongoose_admin = require('../')
  , http = require('http')
  , mongoose = require('mongoose')
  , should = require('should');

process.cwd().should.include.string('mongoose-admin/test');

var modelData = {
    stringField:{type:String},
    dateField:{type:Date}
};
var modelSchema = new mongoose.Schema(modelData);
mongoose.model('Model', modelSchema);

var admin = mongoose_admin.createAdmin('localhost://mongodb/test', 8001);
admin.registerModel('Model', modelData, {'list':['stringField'], 'sort':['dateField']});

admin.getRegisteredModels(function(err, models) {
    should.not.exist(err);
    models.length.should.eql(1);
    models[0].modelName.should.eql('Model');

    admin.close();
});
