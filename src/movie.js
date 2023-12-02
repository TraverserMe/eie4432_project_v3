import express from 'express';
import multer from 'multer';
import movieFunctions from './moviedb.js';

//update_movie(moviename, password, email, role, enable)=>(true/false),
//fetch_movie(moviename)=>(movie),
//moviename_exist(moviename)=>(true/false)
const { update_movie, fetch_movie, moviename_exist, delete_movie, get_all_movies,  update_movie2 } = movieFunctions;

// router handler for POST /login
const router = express();
const form = multer();

router.get('/getall', async (req, res) => {
    const movies = await get_all_movies();
    if (movies) {
        res.json({
            status: 'success',
            movies
        })
    } else {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to get the database!',
        });
    }
});


router.post('/add', form.any(), async (req, res) => {
    const { add_movie_name, add_movie_type, add_movie_adult_fee, add_movie_student_fee, add_movie_elderly_fee, add_movie_duration, add_image_url } = req.body;
    const movies = await get_all_movies();
    if (!movies) {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to get the database!',
        });
        return;
    }
    if (movies.find(movie => movie.name === add_movie_name)) {
        res.status(400).json({
            status: 'failed',
            message: 'Moviename is used, plese edit rather than add movie!',
        });
        return;
    }
    if (await update_movie(add_movie_name, add_movie_type, add_movie_adult_fee, add_movie_student_fee, add_movie_elderly_fee, add_movie_duration, add_image_url)) {
        res.json({
            status: 'success',
            movie: {
                name: add_movie_name,
            },
        });
    } else {
        res.status(500).json({
            status: 'failed',
            message: 'Account created but unable to save into the database',
        });
    }

});

router.post('/edit', form.any(), async (req, res) => {
    const { edit_movie_name, edit_movie_type, edit_movie_adult_fee, edit_movie_student_fee, edit_movie_elderly_fee, edit_movie_duration, edit_image_url} = req.body;
    const movies = await get_all_movies();
    if (!movies) {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to get the database!',
        });
        return;
    }
    const foundmovie = movies.find(movie => movie.name === edit_movie_name)
    if (!foundmovie) {
        res.status(400).json({
            status: 'failed',
            message: 'Moviename is not exist, please add rather than edit movie(img)!',
        });
        return;
    }

    if (await update_movie(edit_movie_name, edit_movie_type, edit_movie_adult_fee, edit_movie_student_fee, edit_movie_elderly_fee, edit_movie_duration, edit_image_url)) {
        res.json({
            status: 'success',
            movie: {
                name: edit_movie_name,
            },
        });
    } else {
        res.status(500).json({
            status: 'failed',
            message: 'Account created but unable to save into the database',
        });
    }

});

router.post('/edit2', form.any(), async (req, res) => {
    const { edit_movie_name, edit_movie_type, edit_movie_adult_fee, edit_movie_student_fee, edit_movie_elderly_fee, edit_movie_duration} = req.body;
    const movies = await get_all_movies();
    if (!movies) {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to get the database!',
        });
        return;
    }
    const foundmovie = movies.find(movie => movie.name === edit_movie_name)
    if (!foundmovie) {
        res.status(400).json({
            status: 'failed',
            message: 'Moviename is not exist, please add rather than edit movie!',
        });
        return;
    }

    if (await update_movie2(edit_movie_name, edit_movie_type, edit_movie_adult_fee, edit_movie_student_fee, edit_movie_elderly_fee, edit_movie_duration)) {
        res.json({
            status: 'success',
            movie: {
                name: edit_movie_name,
            },
        });
    } else {
        res.status(500).json({
            status: 'failed',
            message: 'Account created but unable to save into the database',
        });
    }

});

router.post('/delete', form.none(), async (req, res) => {
    const { delete_movie_name } = req.body;
    const movies = await get_all_movies();
    if (!movies) {
        res.status(400).json({
            status: 'failed',
            message: 'Unable to get the database!',
        });
        return;
    }
    const foundmovie = movies.find(movie => movie.name === delete_movie_name)
    if (!foundmovie) {
        res.status(400).json({
            status: 'failed',
            message: 'Moviename is not exist, unable to delete!',
        });
        return;
    }
    if (await delete_movie(delete_movie_name)) {
        res.json({
            status: 'success',
            movie: {
                name: delete_movie_name,
            },
        });
    } else {
        res.status(500).json({
            status: 'failed',
            message: 'Account created but unable to save into the database',
        });
    }

});

export default router;
