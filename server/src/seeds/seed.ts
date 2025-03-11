import db from "../config/connection.js";
import Question from "../models/Question.js";
import cleanDB from "./cleanDb.ts/index.js";

// import Questions from './Questions.json' assert { type: "json" };
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const questionData = require('./Questions.json');

db.once('open', async () => {
  await cleanDB('Question', 'questions');

  // await Question.insertMany(Questions);
  await Question.insertMany(questionData);  

  console.log('Questions seeded!');
  process.exit(0);
});
