import {pool} from '../app';
// const pool = require('../app.js');
const fs = require('fs');
const path = require('path');




    
module.exports = function(router){

    router.get('/weeks', (req, res) => {

        pool.query(
            `SELECT * FROM weeks`,
            (err, weeks) => {
            if(err) return res.status(500).send(err);

            pool.query(
                `SELECT * FROM lessons`,
                (err, lessons) => {
                if(err) return res.status(500);
                const response = weeks.rows.map(week => {
                    return Object.assign({}, {
                        title: week.title,
                        lessons: lessons.rows.filter(lesson => lesson.week_id === week.id)
                    })
                });
                res.send(response)
            })
        })
    })

    router.get('/lessons/:lesson_id/posts', (req, res) => {
        const id = req.params.lesson_id;
        pool.query(
            `SELECT * FROM tags
            INNER JOIN posttags
                ON posttags.tag_id = tags.id
            INNER JOIN posts
                ON posttags.post_id = posts.id
            `,
            (err, posts) => {
            if(err) return res.status(500);
            return res.status(200).json(posts.rows);
        })
    })   

    return router;
}