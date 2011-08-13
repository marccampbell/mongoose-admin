var querystring = require('querystring'),
    Url = require('url'),
    sys = require('sys'),
    MongooseAdmin = require('../../mongoose-admin'),
    Renderer = require('../renderer').Renderer;

exports.index = function(req, res) {
    var adminUser = req.session._mongooseAdminUser ? MongooseAdmin.userFromSessionStore(req.session._mongooseAdminUser) : null;
    if (!adminUser) {
        res.redirect('/login');
    } else {
        MongooseAdmin.singleton.getRegisteredModels(function(err, models) {
            if (err) {
                res.redirect('/error');
            } else {
                res.render('models',
                           {layout: 'adminlayout.jade',
                            locals: {
                                'pageTitle': 'Admin Site',
                                'models': models
                            }
                           });
            }
        });
    }
};

exports.login = function(req, res) {
    res.render('login',
               {layout: 'anonlayout.jade',
                locals: {
                      'pageTitle': 'Admin Login'
                }
               });
};

exports.logout = function(req, res) {
    req.session._mongooseAdminUser = undefined;
    res.redirect('/');
};

exports.model = function(req, res) {
    var adminUser = req.session._mongooseAdminUser ? MongooseAdmin.userFromSessionStore(req.session._mongooseAdminUser) : null;
    if (!adminUser) {
        res.redirect('/login');
    } else {
        MongooseAdmin.singleton.getRegisteredModels(function(err, models) {
            if (err) {
                res.redirect('/');
            } else {
                MongooseAdmin.singleton.getModel(req.params.modelName, function(err, model, fields, options) {
                    if (err) {
                        res.redirect('/error');
                    } else {
                        MongooseAdmin.singleton.listModelDocuments(req.params.modelName, 0, 50, function(err, documents) {
                            if (err) {
                                res.redirect('/');
                            } else {
                                res.render('model',
                                           {layout: 'adminlayout.jade',
                                            locals: {
                                                'pageTitle': 'Admin - ' + model.modelName,
                                                'models': models,
                                                'modelName': req.params.modelName,
                                                'model': model,
                                                'listFields': options.list,
                                                'documents': documents
                                            }
                                           });
                            }
                        });
                    }
                });
            }
        });
    }
};

exports.document = function(req, res) {
    var adminUser = req.session._mongooseAdminUser ? MongooseAdmin.userFromSessionStore(req.session._mongooseAdminUser) : null;
    if (!adminUser) {
        res.redirect('/login')
    } else {
        MongooseAdmin.singleton.getRegisteredModels(function(err, models) {
            if (err) {
                res.redirect('/');
            } else {
                MongooseAdmin.singleton.getModel(req.params.modelName, function(err, model, fields, options) {
                    if (err) {
                        res.redirect('/error');
                    } else {
                        if (req.params.documentId === 'new') {
                            Renderer.renderDocument(models, fields, options, null, function(html) {
                                res.render('document',
                                           {layout: 'adminlayout.jade',
                                            locals: {
                                                'pageTitle': 'Admin - ' + model.modelName,
                                                'models': models,
                                                'modelName': req.params.modelName,
                                                'model': model,
                                                'fields': fields,
                                                'renderedDocument': html,
                                                'document': {},
                                                'allowDelete':false
                                           }
                                          });
                            });
                        } else {
                            MongooseAdmin.singleton.getDocument(req.params.modelName, req.params.documentId, function(err, document) {
                                if (err) {
                                    res.redirect('/error');
                                } else {
                                    Renderer.renderDocument(models, fields, options, document, function(html) {
                                        res.render('document',
                                                   {layout: 'adminlayout.jade',
                                                    locals: {
                                                       'pageTitle': 'Admin - ' + model.modelName,
                                                       'models': models,
                                                       'modelName': req.params.modelName,
                                                       'model': model,
                                                       'fields': fields,
                                                       'renderedDocument': html,
                                                       'document': document,
                                                       'allowDelete': true
                                                   }
                                                 });
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};

