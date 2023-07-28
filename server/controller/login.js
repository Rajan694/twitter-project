const client = require('../connection/connection.js');

// adminLogin
const adminLogin = (req, res) => {
    console.log(req.body);
    console.log('logging in the admin');
    const query = `SELECT adminid as userid, admin_name as username, cover_image, displayname, email, password, profile_image, bio, gender FROM admin WHERE email = '${req.body.email}'`;
    console.log(query);

    client.query(query, (error, result) => {
        if(error)
        {
            console.log('some error occured');
            res.status(500).send(error);
        }
        else
        {
            console.log(result.rowCount);
            if(result.rowCount == 0)
            {
                console.log('no admin found');
                res.status(203).send('no admin found');
            }
            else if(result.rowCount > 1)
            {
                console.log('more than 1 row');
                res.status(203).send('found more than 1 row');
            }
            else
            {
                if(result.rows[0].password != req.body.password)
                {
                    res.status(203).send('incorrect password');
                }
                else
                {
                    res.status(200).send(result.rows[0]);
                }
            }
        }
    })

};


// user login 
const userLogin = (req, res) => {
    console.log('logging in user');
    // const query = `SELECT u.*, COUNT(t.tweetid) AS totalTweets FROM users u LEFT JOIN tweets t ON t.userid = u.userid WHERE u.email = '${req.body.email}' AND t.action = 'show' GROUP BY u.userid `;
    const query = `SELECT u.* FROM users u WHERE u.email = '${req.body.email}'`;

    client.query(query, (error, result) => {
        if(error)
        {
            console.log('some error occured');
            res.status(500).send(error);
        }
        else
        {
            console.log('succesfful');
            console.log(req.body);
            if(result.rowCount == 0)
            {
                res.status(203).send('no user found, kindly register first');
            }
            else if(result.rowCount == 1)
            {
                if(result.rows[0].password != req.body.password)
                {
                    res.status(203).send('incorrect password');
                }
                else
                {
                    res.status(200).send(result.rows[0]);
                }
            }
            else
            {
                res.status(203).send('more than 1 user found');
            }
        }
    })
};



module.exports = {
    adminLogin,
    userLogin
}