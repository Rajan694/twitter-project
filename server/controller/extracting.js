const client = require("../connection/connection.js");

// get all users
const getAllUsers = (req, res) => {
  console.log("extracting all users");
  const query = `SELECT * FROM users ORDER BY userid ASC`;

  client.query(query, (error, result) => {
    if (error) {
      console.log("some error occured");
      res.status(500).send(error);
    } else if(result.rowCount == 0) {
      res.status(203).send('No User found'); 
    }
    else{
      res.status(200).send(result.rows);
    }
  });
};

// get a particular user from user id
const getAUser = (req, res) => {
  const id = JSON.parse(req.params.id);
  let query = '';
  if(id.includes('am'))
  {
    // query = `SELECT a.adminid AS userid, a.admin_name as username, a.displayname, a.profile_image, COUNT(t.tweetid) AS totalTweets FROM admin a LEFT JOIN tweets t ON t.userid = a.adminid WHERE a.adminid = '${id}' AND t.action = 'show' GROUP BY a.adminid`;
    query = `SELECT a.adminid AS userid, a.admin_name AS username, a.displayname, a.cover_image, a.profile_image, a.email, a.bio, a.gender, a.password FROM admin a WHERE a.adminid = '${id}'`;
  }
  else
  {
    // query = `SELECT u.*, COUNT(t.tweetid) as totalTweets FROM users u LEFT JOIN tweets t ON u.userid = t.userid WHERE u.userid = '${id}' AND t.action = 'show' GROUP BY u.userid`;
    query = `SELECT * FROM users WHERE userid = '${id}'`;
  }
  console.log(query);
  client.query(query, (error, result) => {
    if (error) {
      console.log("some error occured");
      res.status(500).send(error);
    } else {
      if (result.rowCount == 0) {
        res.status(203).send("no user found");
      } else if (result.rowCount == 1) {
        res.status(200).send(result.rows);
      } else {
        res.status(203).send("multiple user detected");
      }
    }
  });
};

// get a user by searching for user name or display name.
const getUserByName = (req, res) => {
  console.log('returning users');
  const query = `SELECT * FROM users WHERE LOWER(username) LIKE '%${req.body.name}%' OR LOWER(displayname) LIKE '%${req.body.name}%'`;

  client.query(query, (error, result) => {
    if(error)
    {
      console.log(error);
      res.status(500).send('some error occured, could not search for user');
    }
    else if(result.rowCount == 0)
    {
      res.status(203).send('No user found...');
    }
    else
    {
      console.log('user(s) found');
      res.status(200).send(result.rows);
    }
  })

}

// get all tweets alongwith the user
const getTweets = (req, res) => {
  console.log("giving all tweets");
  const query = `(SELECT t.*, u.username, u.displayname, u.profile_image FROM tweets t INNER JOIN users u ON t.userid = u.userid WHERE t.action = 'show') UNION (SELECT t.*, a.admin_name AS username, a.displayname, a.profile_image FROM tweets t INNER JOIN admin a ON t.userid = a.adminid WHERE t.action = 'show') ORDER BY tweetid DESC`;

  client.query(query, (error, result) => {
    if (error) {
      console.log("some error occured");
      res.status(500).send(error);
    } else if (result.rowCount == 0) {
      res.status(203).send("no tweet found");
    } else {
      res.status(200).send(result.rows);
    }
  });
};

// get a particular tweet using tweet id
const getATweet = (req, res) => {
  console.log("returning a particular tweet");
  const id = parseInt(req.params.id);

  const query = `SELECT * FROM tweets t INNER JOIN users u ON t.userid = u.userid WHERE t.tweetid = ${id} AND t.action = 'show'`;

  client.query(query, (error, result) => {
    if (error) {
      console.log("some error occured");
      res.status(500).send(error);
    } else if (result.rowCount == 0) {
      res.status(203).send("no tweet found");
    } else if (result.rowCount == 1) {
      res.status(200).send(result.rows);
    } else {
      res.status(203).send("more than 1 tweet");
    }
  });
};

module.exports = {
  getAllUsers,
  getAUser,
  getUserByName,
  getTweets,
  getATweet,
};
