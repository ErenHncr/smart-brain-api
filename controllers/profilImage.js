const aws = require('aws-sdk');
const fs = require('fs');


require('dotenv').config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET
});

const uploadImageToS3 = (req, res) => {
  let profileImage = req.files.profileImage;
  // get image type
  let mimeType = profileImage.mimetype.split("/")[1];
  const { id } = req.params;

  const imageSize = parseFloat((profileImage.size / 1024) / 1024);
  // check image size to be max 3MB
  if (imageSize > 3) {
    return res.status(400).json('image size should be max 3MB')
  }

  if (profileImage && id && mimeType === "jpeg") {
    // save images to ./uploads folder
    profileImage.mv(`./uploads/${id}.${mimeType}`, function (err) {
      if (err) {
        return res.status(500).send('Error uploading image');
      }

      let imageLocation = `./uploads/${id}.jpeg`;
      // read files from ./uploads folder
      fs.readFile(imageLocation, (err, data) => {
        if (err) return res.status(400).json('Error reading image')

        // Setting up S3 upload parameters
        const s3params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: id + '.jpg', // File name you want to save as in S3
          Body: data,
          ACL: 'public-read'
        };

        // Uploading files to the bucket
        s3.upload(s3params, function (err, data) {
          if (err) {
            return res.status(400).json('Error uploading image to S3')
          }
          // delete id.jpg image from ./uploads/ folder
          fs.unlink(imageLocation, (err) => {
            if (err) console.log('error deleting image')
            console.log(`${imageLocation} deleted`);
          })

          res.status(200).send('File uploaded!');
        });
      });
    });
  }
  else {
    return res.status(400).send('id should not be empty and file type should be in jpeg format');
  }
}

const getImageFromS3 = (req, res) => {
  const { id } = req.params;

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: id + '.jpg'
  };

  s3.getObject(s3Params, function (err, data) {
    if (err) {
      return res.status(400).json({
        error: true,
        message: 'error getting image from aws s3 service'
      })
    } else {
      let buffer = new Buffer.from(data.Body, 'base64');

      res.setHeader('Content-Type', 'image/jpg');
      res.end(new Buffer.from(buffer, 'base64'));
    }
  })

};

module.exports = {
  uploadImageToS3,
  getImageFromS3
}