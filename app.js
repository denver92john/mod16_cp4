const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const playstore = require('./playstore');

app.get('/apps', (req, res) => {
    const genresArray = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
    const {genres, sort} = req.query;

    if(genres) {
        if(!genresArray.includes(genres)) {
            return res
                .status(400)
                .send(`${genres} is not one of the listed genres`);
        }
    }    

    if(sort) {
        if(!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of rating or app');
        }
    }

    let results = playstore;

    // link to explain sort method
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description
    if(sort === "rating") {
        results.sort((a, b) => {
            return b.Rating - a.Rating;
        });
    }

    if(sort === "app") {
        results.sort((a, b) => {
            const nameA = a.App.toUpperCase();
            const nameB = b.App.toUpperCase();
            return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
        })
    }

    res.json(results);
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});