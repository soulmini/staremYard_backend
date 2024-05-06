import express from 'express'

const router = express.Router();


router.post('/signup', (req, res) => {

    //const {firstName, lastName, email, password} = req.body;
    console.log(req.body);

    // store the data in db using prisma or mongodb
    try {
        

    } catch (error) {

        return res.status(500).json({error : 'Internal Server Error'})
    }

    return res.json({message : "got"});
})


export default router;