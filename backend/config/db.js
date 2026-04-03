import mongoose from "mongoose";

export const connectDB = async()=>{
     await mongoose.connect('mongodb+srv://pandeysaurav108_db_user:quizApp56@cluster0.jscpmlj.mongodb.net/QuizApp')
     .then(()=>{console.log('DB CONNECTED ')})
}