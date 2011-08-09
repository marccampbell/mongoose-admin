var querystring = require('querystring'),
    Url = require('url'),
    sys = require('sys'),
    MongooseAdmin = require('../../mongoose-admin');

exports.login = function(req, res) {
    MongooseAdmin.singleton.login(req.body.username, req.body.password, function(err, adminUser) {
        if (err) {
            res.writeHead(500);
            res.end();
        } else {
            if (!adminUser) {
                res.writeHead(401);
                res.end();
            } else {
                req.session._mongooseAdminUser = adminUser.toSessionStore();
                res.writeHead(200, {"Content-Type": "application/json"});
                res.write("{}");
                res.end();
            }
        }
    });
};


