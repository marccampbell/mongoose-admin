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
admin.ensureUserExists('admin', 'password');
admin.registerModel('Model', modelData, {'list':['stringField'], 'sort':['dateField']});

admin.login('admin', 'password', function(err, adminUser) {
    admin.listModelDocuments('models', 0, 50, function(err, documents) {
        var beforeDocumentCount = documents.length;

        admin.createDocument(adminUser, 'models', {stringField:'1',
                                        dateField:new Date}, function(err, document) {
            should.not.exist(err);

            admin.listModelDocuments('models', 0, 50, function(err, documents) {
                documents.length.should.eql(beforeDocumentCount + 1);

                admin.getDocument('models', document._id, function(err, fetchedDocument) {
                    should.not.exist(err);
                    document.stringField.should.eql(fetchedDocument.stringField);

                    admin.deleteDocument(adminUser, 'models', document._id, function(err) {
                        should.not.exist(err);

                        admin.close();
                        process.exit(0);
                    });
                });
            });

        });
    });
});
