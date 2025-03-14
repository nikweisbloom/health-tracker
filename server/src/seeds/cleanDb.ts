// import Question from '../models/index.js';
import models from '../models/index.js';
import db from '../config/connection.js';
// import mongoose, { Schema, Document, Model } from 'mongoose';
// import mongoose from 'mongoose';
// import User from '../models/User';

export default async (modelName: "Question", collectionName: string) => {
  try {
    // let modelExists = await models[modelName].db.db.listCollections({
    const model = models[modelName];
    if (model && model.db && model.db.db) {
      let modelExists = await model.db.db.listCollections({    
      name: collectionName
    }).toArray()

    if (modelExists.length) {
      await db.dropCollection(collectionName);
      // await db.db.dropCollection(collectionName);
      // await mongoose.connection.db.dropCollection(collectionName);
    }
    } else {
      throw new Error(`Model "${modelName}" does not exist.`);
    }
  } catch (err) {
    throw err;
  }
}