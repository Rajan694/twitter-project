const client = require("../connection/connection.js");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// require('../../client/src/assets/images')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../client/src/assets/images/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024
    }
}).fields([
  {name: 'profileImage', maxCount: 1},
  {name: 'coverImage', maxCount: 1}
])

// const uploadBackground = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024
//   }
// }).array('coverImage', 1);


// to check if an email is already in use or not.
const checkUser = (req, res) => {
  console.log('checking email availability');
  const checkQuery = `SELECT * FROM users WHERE email = '${req.body.email}'`;

  client.query(checkQuery, (error, result) => {
    if(error)
    {
      console.log(error);
      res.status(500).send('some error occured, please try again');
    }
    else
    {
      if(result.rowCount == 0)
      {
        res.status(200).send('No user found');
      }
      else
      {
        res.status(203).send('user already present');
      }
    }
  })

}

const userSignup = (req, res, next) => {
  console.log("signing up the user");
  
  upload(req, res, function(err) {
    if(err)
    {
      console.log(err);
      res.status(500).send('some error occured');
    }
    else
    {
      const files = req.files;
      const data = JSON.parse(req.body.info);
      console.log(files);
      console.log(data);
      let query = '';

      if(files.length == 0)
      {
        query = `INSERT INTO users(username, displayname, email, password, gender) VALUES
        ('${data.username}', '${data.displayname}', '${data.email}', '${data.password}', '${data.gender}')`;
        
      }
      else
      {
        query = `INSERT INTO users(username, displayname, email, password, profile_image, gender) VALUES
        ('${data.username}', '${data.displayname}', '${data.email}', '${data.password}', '${files[0].filename}', '${data.gender}')`;
      }
      

      console.log(query);
      client.query(query, (error, result) => {
        if(error)
        {
          console.log(error);
          res.status(500).send('could not register user, please try again');
        }
        else
        {
          console.log('user registered succesfullty');
          res.status(200).send('user registered successfully');
        }
      })
    }
  })


};

// editing a user details
const editUser = (req, res) => {

  console.log("editting a user details");
  const id = JSON.parse(req.params.id);
  console.log(id);

  let tableName = '';
  let primaryKey = '';

  if(id.includes('am'))
  {
    primaryKey = 'adminid';
    tableName = 'admin';
  }
  else
  {
    tableName = 'users';
    primaryKey = 'userid';
  }
  const checkQuery = `SELECT * FROM ${tableName} WHERE ${primaryKey} = '${id}'`;

  client.query(checkQuery, (error, result) => {
    if (error) 
    {
      console.log(error);
      res.status(500).send("some error occured..");
    } 
    else if (result.rowCount == 0) 
    {
      res.status(203).send("No user found");
    } 
    else 
    {
      // uploading the new image.
     
      upload(req, res, function(err){
        if(err)
        {
          console.log(err);
          res.status(500).send('Some error occured, retry again');
        }
        else
        {
          // new file has been uploaded.
          console.log(req.files);
          console.log(req.body);
          const files = req.files.profileImage;

          const userData = JSON.parse(req.body.user);
          console.log(userData);
          const dirPath = path.join(__dirname, '../../client/src/assets/images/');
          let imagePath = '';
          let removalRequired = true;
          let currImagePath = '';
          let filename = '';
          let updateRequired = true;
          console.log(typeof(files));
          // if previously no image is present, and currently no image is uploaded = no need to change.
          // if previosuly no image is present, and currently an image is uploaded = need to change
          // if previously image is present and currently no new image is uploaded = no need to change.
          // if previously image is present and currently an image is uploaded = need to change.


          if(typeof(files) === 'undefined')     // means no image is uploaded.
          {
            updateRequired = false;
            query = `UPDATE ${tableName} SET displayname = '${userData.displayname}',  password = '${userData.password}', bio = '${userData.bio}' WHERE ${primaryKey} = '${userData.userid}'`;

            console.log(query);

            client.query(query, (error, result) => {
              if (error) {
                console.log("some error occured");
                res.status(500).send(error);
              } else {
                res.status(200).send("Updated Information Successfully!");
              }
            });
    
          }

          else
          {
            updateRequired = true;

            if(userData.profile_image == '' || userData.profile_image == null) // if no image was previously present.
            {
              removalRequired = false;
            }
            else
            {
              filename = userData.profile_image;
              imagePath = dirPath + filename;
              removalRequired = true;
            }
            console.log(removalRequired, imagePath);

            if(!removalRequired)      // if no image is found previously
            {
              query = `UPDATE ${tableName} SET displayname = '${userData.displayname}', password = '${userData.password}', bio = '${userData.bio}', profile_image = '${files[0].filename}' WHERE ${primaryKey} = '${id}'`;
              console.log(query);
  
              client.query(query, (error, result) => {
                if (error) {
                  console.log("some error occured");
                  res.status(500).send(error);
                } else {
                  res.status(200).send("Updated Information Successfully!");
                }
              });
            }
            else    // if previously image is found and removal of that image is required.
            {
              console.log('deleting');
              fs.unlink(imagePath, function(err) {
                if(err)
                {
                  // if deletion failed, unlink the new image which was uploaded.
                  
                  fs.unlink(currImagePath);
                  console.log('unlinked the posted file too');
                  res.status(500).send('Could not Update, retry again');
                }
                else
                {
                  console.log('deleted');
                  // if deletion is successful, then update tha table.
                  const query = `UPDATE ${tableName} SET displayname = '${userData.displayname}', password = '${userData.password}',bio = '${userData.bio}', profile_image = '${files[0].filename}' WHERE ${primaryKey} = '${id}'`;
                  console.log(query);
    
                  client.query(query, (error, result) => {
                    if (error) {
                      console.log("some error occured");
                      res.status(500).send(error);
                    } else {
                      res.status(200).send("Updated Information Successfully!");
                    }
                  });
                }
              });

            }

          }
            
        }
      })

    }
  });

};


const updateBackground = (req, res) => {
  upload(req, res, function(err){
    if(err)
    {
      console.log(err);
      res.status(500).send('could not upload the background image');
    }
    else
    {
      const files = req.files.coverImage;
      console.log(files);
      if(files.length == 0)   // no file was uploaded.
      {
        // no update required.
        res.status(200).send('updated');
      }
      else
      {
        const id = JSON.parse(req.params.id);
        let table = '';
        let primaryKey = '';
        if(id.includes('am'))
        {
          table = 'admin';
          primaryKey = 'adminid';
        }
        else
        {
          table = 'users';
          primaryKey = 'userid';
        }
        const query = `UPDATE ${table} set cover_image = '${files[0].filename}' WHERE ${primaryKey} = '${id}'`;
        console.log(query);
        client.query(query, (error, result) => {
          if(error)
          {
            fs.unlink(files[0].path, function(err) {
              if(err)
              {
                console.log(error);
              }
            })
            res.status(500).send('could not update, retry again');
          }
          else
          {
            res.status(200).send('updated successfully');
          }
        })
      }
    }
  })
}

module.exports = {
  userSignup,
  editUser,
  checkUser,
  updateBackground
};
