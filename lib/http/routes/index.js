var querystring = require('querystring'),
    Url = require('url'),
    sys = require('sys'),
    MongooseAdmin = require('../../mongoose-admin'),
    Renderer = require('../renderer').Renderer;

exports.index = function(req, res) {
    var adminUser = req.session._mongooseAdminUser ? MongooseAdmin.userFromSessionStore(req.session._mongooseAdminUser) : null;
    if (!adminUser) {
        res.redirect(MongooseAdmin.singleton.buildPath('/login'));
    } else {
        MongooseAdmin.singleton.getRegisteredModels(function(err, models) {
            if (err) {
                res.redirect('/error');
            } else {
                var config = MongooseAdmin.singleton.pushExpressConfig();
                res.render('models',
                           {layout: 'adminlayout.jade',
                            locals: {
                                'pageTitle': 'Admin Site',
                                'models': models,
                                'rootPath': MongooseAdmin.singleton.root
                            }
                           });
                MongooseAdmin.singleton.popExpressConfig(config);
            }
        });
    }
};

exports.login = function(req, res) {
    var config = MongooseAdmin.singleton.pushExpressConfig();
    res.render('login',
               {layout: 'anonlayout.jade',
                locals: {
                      'pageTitle': 'Admin Login'
                }
               });
    MongooseAdmin.singleton.popExpressConfig(config);
};

exports.logout = function(req, res) {
    req.session._mongooseAdminUser = undefined;
    res.redirect(MongooseAdmin.singleton.buildPath('/'));
};

exports.model = function(req, res) {
    var query = querystring.parse(Url.parse(req.url).query);
    var start = query.start ? parseInt(query.start) : 0;
    var count = query.count ? parseInt(query.count) : 50;

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
                        MongooseAdmin.singleton.modelCounts(req.params.modelName, function(err, totalCount) {
                            if (err) {
                                res.redirect('/');
                            } else {
                                MongooseAdmin.singleton.listModelDocuments(req.params.modelName, start, count, function(err, documents) {
                                    if (err) {
                                        res.redirect('/');
                                    } else {
                                        var config = MongooseAdmin.singleton.pushExpressConfig();
                                        res.render('model',
                                                   {layout: 'adminlayout.jade',
                                                    locals: {
                                                        'pageTitle': 'Admin - ' + model.modelName,
                                                        'models': models,
                                                        'totalCount': totalCount,
                                                        'modelName': req.params.modelName,
                                                        'model': model,
                                                        'start': start,
                                                        'count': count,
                                                        'listFields': options.list,
                                                        'documents': documents,
                                                        'rootPath': MongooseAdmin.singleton.root
                                                    }
                                                   });
                                        MongooseAdmin.singleton.popExpressConfig(config);
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
                                var config = MongooseAdmin.singleton.pushExpressConfig();
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
                                                'allowDelete':false,
                                                'rootPath': MongooseAdmin.singleton.root
                                           }
                                          });
                                MongooseAdmin.singleton.popExpressConfig(config);
                            });
                        } else {
                            MongooseAdmin.singleton.getDocument(req.params.modelName, req.params.documentId, function(err, document) {
                                if (err) {
                                    res.redirect('/error');
                                } else {
                                    Renderer.renderDocument(models, fields, options, document, function(html) {
                                        var config = MongooseAdmin.singleton.pushExpressConfig();
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
                                                       'allowDelete': true,
                                                       'rootPath': MongooseAdmin.singleton.root
                                                   }
                                                 });
                                        MongooseAdmin.singleton.popExpressConfig(config);
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

