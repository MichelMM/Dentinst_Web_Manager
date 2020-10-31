require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
let url = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;

url = url.replace("<user>",user).replace("<password>",password).replace("<dbname>",dbname);


function connectMongo(collectionName, filter) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, {
            useUnifiedTopology: true
        }, function (err, client) {
            if (err == null) {
                const db = client.db();
                const collection = db.collection(collectionName);
                resolve({
                    find: function (callback) {
                        collection.find(filter|| {}).toArray(function (err, res) {
                            callback(res);
                            client.close();
                        });
                    }
                });
            } else {
                reject(err)
            }
        });
    });
}


function updateMongo(collectionName, filter, data, many) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, {
            useUnifiedTopology: true
        }, function (err, client) {
            if (err == null) {
                const db = client.db();
                const collection = db.collection(collectionName);
                if (many) {//Update many or one
                    resolve({
                        update: function (callback) {
                            //Update first document after filter
                            collection.updateMany(filter|| {}, data).toArray(function (err, res) {
                                callback(res);
                                client.close();
                            });
                        }
                    }); 
                }else{
                    resolve({
                        update: function (callback) {
                            collection.updateOne(filter|| {}, data).toArray(function (err, res) {
                                callback(res);
                                client.close();
                            });
                        }
                    });
                }
                
            } else {
                reject(err)
            }
        });
    });
}

module.exports = {connectMongo,updateMongo};
