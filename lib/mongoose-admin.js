/*!
 * Mongoose Admin
 * Copyright (c) 2011 Marc Campbell (marc.e.campbell@gmail.com)
 * MIT Licensed
 */


 /**
  * Module dependencies
  */
var sys = require('sys'),
    MongooseAdminUser = require('./mongoose_admin_user.js').MongooseAdminUser,
    mongoose = require('mongoose');

exports = module.exports = MongooseAdmin;
exports.version = '0.0.1';

var app;

exports.createAdmin = function(dbUri, port) {
    var app = app || (app = require('./http'));
    app.listen(port);
    console.log('\x1b[36mMongooseAdmin is listening on port: \x1b[0m %d', port);
    console.log('\x1b[36mMongooseAdmin is connected using db: \x1b[0m %s', dbUri);
    return MongooseAdmin.singleton = new MongooseAdmin(dbUri);
};

function MongooseAdmin(dbUri) {
    mongoose.connect(dbUri);
    this.models = {};
};

MongooseAdmin.prototype.registerModel = function(modelName, fields, options) {
    var schema = new mongoose.Schema(fields);
    var model = mongoose.model(modelName, schema);
    this.models[model.collection.name] = {model: model,
                                          options: options};
    console.log('\x1b[36mMongooseAdmin registered model: \x1b[0m %s', modelName);

};

MongooseAdmin.prototype.getRegisteredModels = function(onReady) {
    var models = [];
    for (collectionName in this.models) {
        models.push(this.models[collectionName].model);
    };
    onReady(null, models);
};

MongooseAdmin.prototype.getModel = function(collectionName, onReady) {
    onReady(null, this.models[collectionName].model, this.models[collectionName].options);
};

MongooseAdmin.prototype.listModelDocuments = function(collectionName, start, count, onReady) {
    var listFields = this.models[collectionName].options.list;
    this.models[collectionName].model.find({}).skip(start).limit(count).execFind(function(err, documents) {
        if (err) {
            console.log('Unable to get documents for model because: ' + err);
            onReady('Unable to get documents for model', null);
        } else {
            var filteredDocuments = [];
            documents.forEach(function(document) {
                var d = {};
                d['_id'] = document['_id'];
                listFields.forEach(function(listField) {
                  d[listField] = document[listField];
                });
                filteredDocuments.push(d);
            });

            onReady(null, filteredDocuments);
        }
    });
};

MongooseAdmin.prototype.getDocument = function(collectionName, documentId, onReady) {
    this.models[collectionName].model.findById(documentId, function(err, document) {
        if (err) {
            console.log('Unable to get document because: ' + err);
            onReady('Unable to get document', null);
        } else {
            console.log(document);
            onReady(null, document);
        }
    });
};

MongooseAdmin.userFromSessionStore = function(sessionStore) {
    return MongooseAdminUser.fromSessionStore(sessionStore);
};

MongooseAdmin.prototype.ensureUserExists = function(username, password) {
    MongooseAdminUser.ensureExists(username, password, function(err, adminUser) {
        if (!err) {
            console.log('Created admin user: ' + adminUser.fields.username);
        }
    });
};

MongooseAdmin.prototype.login = function(username, password, onReady) {
    MongooseAdminUser.getByUsernamePassword(username, password, function(err, adminUser) {
        onReady(err, adminUser);
    });
};


