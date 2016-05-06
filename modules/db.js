"use strict";
//  var DbObject = require('./objectHelper.js').DbObject;

var mongo = require('mongodb');

class DbClass {
    constructor () {
        this.DB;
        this.COLLECTION = 'session';
    }

    getDb () {
        var that = this;
        this.connect(function () {
            console.log('DB is connecting for the first time');
        });
    }

    connect (callback) {
        var that = this;
        if (that.DB === 'connecting') {
            console.log('DB is already connecting');
            //  callback(that.DB);
        }
    
        try {
            that.DB = 'connecting';
            //  console.log('DbClass.connect, before connecting: ', that.DB);
            var client = mongo.MongoClient;
            var dburl = 'mongodb://localhost:27017/stravegy';
            client.connect(dburl, function (err, db) {
                if (err) {
                    console.log('error connecting to DB', err);
                    throw new Error(err);
                } else {
                    db.on('close', function () {
                        that.DB = null;
                    });
                    that.DB = db;
                    callback(that.DB);
                }
            });
        } catch (e) {
            console.log('caught an error initializing DB: ', e);
        }
    }

    _alive (callback) {
        var that = this;
        try {
            callback();
        } catch (e) {
            console.log('DB is not initialized');
            that.connect(callback);
        }
    }

    close (callback) {
        var that = this;
        that.DB.close(false, function (err, result) {
            if (err) {
                console.log('error closing: ', err);
            } else {
                console.log('database is closed', result);
                callback();
            }
        });
    }

    //  find an appropriate end of the session (browser close/leaving domain)
    expireSession (sessionid, callback) {
        var that = this;
        that.DB.collection(that.COLLECTION).deleteOne(filter, callback);
    }

    //  @sessionid = string sessionid generated at auth
    get (sessionid, field, callback) {
        var that = this;
        that._alive(function () {
            that.DB.collection(that.COLLECTION).findOne({ sessionid: sessionid }, function (err, payload) {
                console.log('in DbClass.get call: ', payload[field]);
                that._dbResponseHandler(err, payload[field], callback);
            });
        });
    }

    //  @sessionid = string sessionid generated at auth
    //  @updateobject = object with key = dbkey
    set (sessionid, updateobject, callback) {
        var that = this;
        that._alive(function () {
            that.DB.collection(that.COLLECTION).updateOne({ sessionid: sessionid }, { $set: updateobject }, { upsert: true }, function (err, payload) {
               that._dbResponseHandler(err, payload, callback);
            });
        });
    }

    //  all error checking is handled here
    _dbResponseHandler (err, payload, callback) {
        if (err) {
            console.log('error querying DB: ', err);
        } else {
            callback(payload); 
        }
    }
}

module.exports = {
    DbClass: DbClass,
};
