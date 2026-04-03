import express from 'express'
import cors from 'cors'
import 'dotenv/config'
const app = express();
const port = 4000;
// MIDDLEWARE
app.use(cors ());
app.use(express.json());
app.use (express.urlencoded({extended : true }));

//DB


// ROUTES
app.get('/',(req , res )=>{
    res.send('API WORKING');
});
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
