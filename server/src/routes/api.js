import {pool} from '../app';
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

module.exports = function(router){
    

    router.get('/weeks', (req, res) => {

        if(!req.cookies.redit_session) {
            console.log('no cookie');
            return res.status(403).send();
        }
        const session = jwt.decode(req.cookies.redit_session);

        pool.query(`SELECT * FROM users WHERE email='${session.user_email}'; `)
            .then((users) => {
                if(users && users.rows.length){
                    `SELECT * FROM weeks`,
                    (err, weeks) => {
                        console.log(week)
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
                        console.log(response)
                        res.send(response)
                    })
                    }
                } else {
                    console.log('oh noooo')
                    return res.status(403).send();
                }
            })
    })

    router.get('/lessons/:lesson_id/posts', (req, res) => {
        const id = req.params.lesson_id;
        pool.query(
            `SELECT * FROM posts
            INNER JOIN posttags
                ON posttags.post_id = posts.id
            INNER JOIN tags
                ON posttags.tag_id = tags.id
            WHERE posts.id = ${id}`, 
            (err, posts) => {
            if(err) return res.status(500);
            return res.status(200).json(posts.rows);
        })
    })   

    return router;
}