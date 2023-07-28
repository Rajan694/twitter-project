const client = require('../connection/connection.js');

// posting a comment on a tweet.
const postComment = (req, res) => {
    console.log('posting a comment..');
    console.log(req.body);
    const query = `INSERT INTO comments(tweetid, userid, comment, postedat) VALUES (${req.body.tweetid},
        '${req.body.userid}', '${req.body.comment}', '${req.body.postedAt}')`;

    console.log(query);
    client.query(query, (error, result) => {
        if(error)
        {
            console.log(error);
            res.status(500).send('could not post comment');
        }
        else
        {
            res.status(200).send('comment posted');
        }
    })
};

// getting all comments on a particular tweet.
const getComments = (req, res) => {
    console.log('returning all the comments on a particular tweet');
    const tweetid = parseInt(req.params.id);
    const query = `SELECT k.* FROM ((SELECT c.*, u.username, u.displayname, u.profile_image FROM comments c INNER JOIN users u ON c.userid = u.userid) UNION (SELECT c.*, a.admin_name AS username, a.displayname, a.profile_image FROM comments c INNER JOIN admin a ON c.userid = a.adminid)) k INNER JOIN tweets t on t.tweetid = k.tweetid WHERE t.tweetid = ${tweetid} ORDER BY k.commentid DESC`;    
    console.log(query);

    client.query(query, (error, result) => {
        if(error)
        {
            console.log(error);
            res.status(500).send('could not load comments');
        }
        else
        {
            if(result.rowCount == 0)
            {
                res.status(203).send('no comments found..');
            }
            else
            {
                res.status(200).send(result.rows);
            }
        }
    })
};

// edit a comment.
const editComment = (req, res) => {
    console.log('editting a comment');
    console.log(req.body);
    const commentid = parseInt(req.params.id);

    const checkQuery = `SELECT * FROM comments WHERE commentid = ${commentid}`;
    client.query(checkQuery, (error, result) => {
        if(error)
        {
            console.log(error);
            res.status(500).send('could not find comment..');
        }
        else
        {
            if(result.rows[0].userid != req.body.userid)
            {
                res.status(203).send('unauthorized request');
            }
            else
            {
                const updateQuery = `UPDATE comments SET comment = '${req.body.comment}' WHERE commentid = ${commentid}`;
                client.query(updateQuery, (error, result) => {
                    if(error)
                    {
                        console.log(error);
                        res.status(500).send('could not update comment');
                    }
                    else
                    {
                        res.status(200).send('comment updated');
                    }
                })
            }
        }
    })


}


// delete a comment.
const deleteComment = (req, res) => {
    const id = req.params.id;
    console.log('deleting comment - ' + id);
    const query = `DELETE FROM comments WHERE commentid = ${id}`;

    client.query('BEGIN');
    client.query(query, (error, result) => {
        if(error)
        {
            console.log(error);
            client.query('ROLLBACK');
            res.status(500).send('could not delete, kindly retry');
        }
        else
        {
            client.query('COMMIT');
            res.status(200).send('deleted');
        }
    })
}


module.exports = {
    postComment,
    getComments,
    editComment,
    deleteComment
}