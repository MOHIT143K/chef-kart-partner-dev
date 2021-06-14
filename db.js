import assert from "assert";
import mongodb from "mongodb";
import { dbName, mongoConnectionString } from "./config/config.js";

const { MongoClient } = mongodb;

let _db;

export const initDb = (callback) => {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }

  const connected = (err, db) => {
    if (err) {
      return callback(err);
    }
    console.log("DB initialized");
    _db = db.db(dbName);
    return callback(null, _db);
  };

  MongoClient.connect(
    mongoConnectionString,
    { useNewUrlParser: true, useUnifiedTopology: true },
    connected
  );
};

export const getDb = () => {
  assert.ok(_db, "Db has not been initialized. Please called init first.");
  return _db;
};
