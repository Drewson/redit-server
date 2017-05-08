import {pool} from '../app'
const jwt = require('jsonwebtoken');

module.exports = function(router){

    router.post('/login', (req, res) => {
        const email = req.body.email
        const password = req.body.password
        
        const query = `SELECT * FROM users WHERE email='${email}' AND password=crypt('${password}', password);`
        pool.query(query, (err, users) => {
            if(users && users.rows.length) {
                const session = {
                    user_email: users.rows[0].email,
                }
                const JWT = jwt.sign(session, 'dsar32dr32');

                res.cookie('redit_session', JWT, {
                    secure: false,
                    maxAge: 72000,
                    httpOnly: true
                }).send('Success, you are logged in');
            } else {
                res.status(403).send();
            }
        })
    })

    // router.get('/logout', (req, res) => {

    // })

    return router;
}