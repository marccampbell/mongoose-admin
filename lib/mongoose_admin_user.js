var sys = require('sys'),
    mongoose = require('mongoose');

function MongooseAdminUser() {
    this.fields = {};

    var AdminUserData = new mongoose.Schema({
        username:{type:String, required:true, unique:true},
        passwordHash:{type:String, required:true}
    });
    mongoose.model('_MongooseAdminUser', AdminUserData);
};

MongooseAdminUser.prototype.toSessionStore = function() {
    var serialized = {};
    for (var i in this) {
        if (typeof i !== 'function' || typeof i !== 'object') {
            serialized[i] = this[i];
        }
    }

    return JSON.stringify(serialized);
};

MongooseAdminUser.fromSessionStore = function(sessionStore) {
    var sessionObject = JSON.parse(sessionStore);
    var adminUser = new MongooseAdminUser();
    for (var i in sessionObject) {
        if (sessionObject.hasOwnProperty(i)) {
            adminUser[i] = sessionObject[i];
        }
    }

    return adminUser;
};

MongooseAdminUser.ensureExists = function(username, password, onReady) {
    var adminUser = new MongooseAdminUser();
    var adminUserModel = mongoose.model('_MongooseAdminUser');

    adminUserModel.findOne({'username': username}, function(err, adminUserData) {
        if (err) {
            console.log('Unable to check if admin user exists because: ' + err);
            oReady('Unable to check if user exist', null);
        } else {
            if (adminUserData) {
                adminUserData.passwordHash = '123';
            } else {
                adminUserData = new adminUserModel();
                adminUserData.username = username;
                adminUserData.passwordHash = '123';
            }
            adminUserData.save(function(err) {
                if (err) {
                    console.log('Unable to create or update admin user because: ' + err);
                    onReady('Unable to create or update admin user', null);
                } else {
                    adminUser.fields = adminUserData;
                    onReady(null, adminUser);
                }
            });
        }
    });
};

MongooseAdminUser.getByUsernamePassword = function(username, password, onReady) {
    var adminUser = new MongooseAdminUser();
    var adminUserModel = mongoose.model('_MongooseAdminUser');

    adminUserModel.findOne({'username': username}, function(err, adminUserData) {
        if (err) {
            console.log('Unable to get admin user because: ' + err);
            onReady('Unable to get admin user', null);
        } else {
            if (adminUserData && adminUserData.passwordHash === password) {
                adminUser.fields = adminUserData;
                onReady(null, adminUser);
            } else {
                onReady(null, null);
            }
        }
    });
};

exports.MongooseAdminUser = MongooseAdminUser;
