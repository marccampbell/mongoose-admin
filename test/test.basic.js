/**
 * Module dependencies.
 */

var mongoose_admin = require('../')
  , http = require('http');

require('./common');

var admin = mongoose_admin.createAdmin('mongodb://localhost/mongoose-admin', {port:8001});
  
process.cwd().should.include.string('mongoose-admin');
http.get({ host: 'localhost', port: 8001 }, function(res) {
    res.on('data', function(chunk) {
    });
    res.on('end', function() {
        res.statusCode.should.equal(302);
        admin.close();
        process.exit(0);
    });
});

