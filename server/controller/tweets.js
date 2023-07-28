const client = require("../connection/connection.js");
// A TWEET CAN HAVE THE FOLLOWING ACTIONS - hide, show, delete

// post a tweet
const tweetPost = (req, res) => {
  console.log("posting a tweet");
  console.log(req.body.userid);
  // req.body = JSON.parse(req.body);
  const query = `INSERT INTO tweets(userid, content, postedat) VALUES ('${req.body.userid}', '${req.body.content}', '${req.body.postedAt}')`;
  console.log(query);

  client.query(query, (error, result) => {
    if (error) {
      console.log("could not post the tweet");
      res.status(500).send(error);
    } else {
      res.status(200).send("posted the tweet");
    }
  });
};

// edit the tweet - delete, hide, update
const editTweet = (req, res) => {
  console.log("editing the tweet");
  const id = parseInt(req.params.id);

  const checkQuery = `SELECT * FROM tweets WHERE tweetid = ${id}`;
  const query = `UPDATE tweets SET content = '${req.body.content}', action = '${req.body.action}' WHERE tweetid = ${id}`;
  console.log(query);

  client.query(checkQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("some error occured");
    } else {
      if (result.rows[0].userid != req.body.userid) {
        res.status(203).send("unauthorized access");
      } else {
        client.query(query, (error, result) => {
          if (error) {
            console.log("some error occured");
            res.status(500).send(error);
          } else {
            console.log(result.rows);
            res.status(200).send("tweet edited");
          }
        });
      }
    }
  });
};

// get all the tweets of a particular user which are not deleted i.e., only the hidden and show
const getUserTweets = (req, res) => {
  console.log("returning all the tweets of a particular user");
  let userid = req.params.id;
  let query = "";
  console.log(userid, typeof userid, userid.length);
  let id = '';
  let checkQuery = '';

 if(userid.length < 10)      // user(not admin) has clicked my profile option
    {
        // userid = parseInt(userid);
        userid = JSON.parse(userid);
        id = userid;
        if(userid.includes('am'))
        {
            checkQuery = `SELECT * FROM admin WHERE adminid = '${id}'`;
            query = `SELECT t.*, a.admin_name as username, a.adminid as userid, a.displayname, a.profile_image FROM tweets t INNER JOIN admin a ON t.userid = a.adminid WHERE t.userid = '${id}' AND action != 'delete' ORDER BY t.tweetid DESC`;
        }
        else
        {
            query = `SELECT t.*, u.username, u.displayname, u.profile_image FROM tweets t INNER JOIN users u ON t.userid = u.userid WHERE t.userid = '${userid}' AND action != 'delete' ORDER BY t.tweetid DESC`;
            checkQuery = `SELECT * FROM users WHERE userid = '${userid}'`;
        }
    }
    else                         // user has searched for a user or the admin has selected my profile option
    {
        userid = JSON.parse(userid);
        console.log(userid);
        id = userid.id;

        // if(userid.role == 'admin')      // if admin selects my profile.
        // {
        //     query = `SELECT t.*, a.admin_name as username, a.displayname, a.profile_image from admin a INNER JOIN tweets t ON a.adminid = t.userid WHERE t.userid = '${id}' AND t.action != 'delete' ORDER BY t.tweetid DESC`;
        //     checkQuery = `SELECT * FROM admin adminid = '${id}'`;
        // }
        if(userid.status)        // if user has searched for any profile.
        {
            if(id.includes("am")) // if admin
            {
                query = `SELECT t.*, a.admin_name as username, a.displayname, a.profile_image from admin a INNER JOIN tweets t ON a.adminid = t.userid WHERE t.userid = '${id}' AND t.action = 'show' ORDER BY t.tweetid DESC`;
                checkQuery = `SELECT * FROM admin WHERE adminid = '${id}'`;
            }
            else
            {
                query = `SELECT t.*, u.username, u.displayname, u.profile_image FROM tweets t INNER JOIN users u ON t.userid = u.userid WHERE t.userid = '${id}' AND action = 'show' ORDER BY t.tweetid DESC`;
                checkQuery = `SELECT * FROM users WHERE userid = '${id}'`;
            }
        }

    }

    console.log(checkQuery);
    console.log(query);
    console.log(userid);
    // if(id.includes('am'))
    // {
    //     client.query(checkQuery, (error, result) => {
    //         if(error)
    //         {
    //             console.log(error);
    //             res.status(500).send('some error occured');
    //         }
    //         else if(result.rowCount == 0)
    //         {
    //             res.status(203).send('no user found');
    //         }
    //     });
    // }
    

    // console.log(query);
    client.query(checkQuery, (error, result) => {
        if(error)
        {
            console.log(error);
            res.status(500).send('some error occured.....');
        }
        else if(result.rowCount == 0)
        {
            res.status(203).send('no user found');
        }
        else
        {
            console.log('getting tweets');
            client.query(query, (error, result) => {
                if(error)
                {
                    console.log('some error occured!');
                    res.status(500).send(error);
                }
                else if(result.rowCount == 0)
                {
                    res.status(203).send('no tweets yet');
                }
                else 
                {
                    res.status(200).send(result.rows);
                }
            });
        }
    });
    
  }


// get tweet by category i.e., show, hidden, delete.
const getTweetByCategory = (req, res) => {
  console.log("returning tweets by category");

  const query = `SELECT t.*, u.username, u.displayname, u.profile_image FROM tweets t INNER JOIN users u ON t.userid = u.userid WHERE t.action = '${req.body.action}'`;
  console.log(query);
  client.query(query, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("some error occured, could not fetch tweets");
    } else if (result.rowCount == 0) {
      res.status(203).send("No tweet found");
    } else {
      res.status(200).send(result.rows);
    }
  });
};

// to store the tweet like info.
const storeLike = (req, res) => {
  console.log('storing likes');
  let likes = req.body;
  const id = req.params.id;
  let query = '';

  if(likes.length == 0)
  {
    query = `UPDATE tweets SET liked_users = NULL WHERE tweetid = ${id}`  ;
  }
  else
  {
    query = `UPDATE tweets SET liked_users = '{${likes}}' WHERE tweetid = ${id}`;
  }
  console.log(query);

  client.query(query, (error, result) => {
    if(error)
    {
      console.log(error);
      res.status(500).send('could not update likes');
    }
    else
    {
      res.status(200).send('likes changed');
    }
  })

}





// // to change the liked status of any tweet using tweet id.
// const updatelike = (req, res) => {
//   console.log("updating likes");
//   const id = parseInt(req.params.id);
//   const query = `UPDATE tweets SET likes = NOT likes WHERE tweetid = ${id}`;
//   console.log(query);
//   client.query(query, (error, result) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("some error occured, could not fetch tweet");
//     } else if (result.rowCount == 0) {
//       res.status(203).send("No tweet found");
//     } else {
//       res.status(200).send(result.rows);
//     }
//   });
// };

module.exports = {
  tweetPost,
  editTweet,
  getUserTweets,
  getTweetByCategory,
  // updatelike,
  storeLike
};
