if (!process.env.NODE_PROD) {//Preguntar si estamos en produccion
    require('dotenv').config();
}
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require("bcryptjs");
let url = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;
const Token = require('../models/token');
const Patient = require('../models/patient');

url = url.replace("<user>", user).replace("<password>", password).replace("<dbname>", dbname);


function getHashedPassword(pass) {
    return bcrypt.hashSync(pass, 12)
}

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
                        collection.find(filter || {}).toArray(function (err, res) {
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
                if (many || false) {//Update many or one
                    resolve({
                        update: async function (callback) {
                            res = await collection.updateMany(filter || {}, data);
                            callback({ matchedCount: res.matchedCount, modifiedCount: res.modifiedCount });
                            client.close();
                        }
                    });
                } else {
                    resolve({
                        update: async function (callback) {
                            res = await collection.updateOne(filter || {}, data, { upsert: true });//Actualiza o crea
                            callback({ matchedCount: res.matchedCount, modifiedCount: res.modifiedCount });
                            client.close();
                        }
                    });
                }

            } else {
                reject(err)
            }
        });
    });
}

function postMongo(collectionName, data) {
    console.log("Controllers:",data)
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, {
            useUnifiedTopology: true
        }, function (err, client) {
            if (err == null) {
                const db = client.db();
                const collection = db.collection(collectionName);
                resolve({
                    post: async function (callback) {
                        // res = await collection.insertOne(data);
                        await collection.insertOne(data).then(respuesta => {
                            callback(respuesta)
                            client.close();
                        }).catch(err => {
                            console.log('------------------------------------');
                            console.log("ERRROR AL CREAR DENTISTA");
                            console.log('------------------------------------');
                            callback({ err: "ERROR" })
                            client.close();
                        })
                        // callback(res);
                        // client.close();
                    }
                });
            } else {
                reject(err);
            }
        });
    });
}

function deleteMongo(collectionName, filter) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, {
            useUnifiedTopology: true
        }, function (err, client) {
            if (err == null) {
                const db = client.db();
                const collection = db.collection(collectionName);
                resolve({
                    delete: async function (callback) {
                        res = await collection.deleteOne(filter);
                        callback(res);
                        client.close();
                    }
                });
            }
        });
    });
}



module.exports = { connectMongo, updateMongo, postMongo, deleteMongo };
