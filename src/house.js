import express from 'express';
import multer from 'multer';
import houseFunctions from './housedb.js';

//update_house(housename, password, email, role, enable)=>(true/false),
//fetch_house(housename)=>(house),
//housename_exist(housename)=>(true/false)
const { update_house, fetch_house, housename_exist, delete_house, get_all_houses } = houseFunctions;

// router handler for POST /login
const router = express();
const form = multer();

router.get('/getall', async (req, res) => {
    const houses = await get_all_houses();
    if (houses) {
        res.json({
            status: 'success',
            houses
        })
    } else {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to get the database!',
        });
    }
});

export default router;
