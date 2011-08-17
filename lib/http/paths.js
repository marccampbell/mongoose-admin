var routes = require('./routes')
    , routesJson = require('./routes/json')
    , path = require('path');

exports.registerPaths = function(app, root) {
    if (root.length > 1) {
        app.get(root, routes.index);
    } else {
        app.get('/', routes.index);
    }
    app.get(path.join(root, '/login'), routes.login);
    app.get(path.join(root, '/logout'), routes.logout);
    app.get(path.join(root, '/model/:modelName'), routes.model);
    app.get(path.join(root, '/model/:modelName/document/:documentId'), routes.document);

    app.post(path.join(root, '/json/login'), routesJson.login);
    app.get(path.join(root, '/json/documents'), routesJson.documents);
    app.post(path.join(root, '/json/model/:collectionName/document'), routesJson.createDocument);
    app.put(path.join(root, '/json/model/:collectionName/document'), routesJson.updateDocument);
    app.delete(path.join(root,  '/json/model/:collectionName/document'), routesJson.deleteDocument);
    app.get(path.join(root, '/json/model/:collectionName/linkedDocumentsList'), routesJson.linkedDocumentsList);
}
