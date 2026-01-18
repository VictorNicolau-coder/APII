const {S3Client} = require('@aws-sdk/client-s3')

require('dotenv').config()
console.log('Bucket recebido:', process.env.BUCKET_NAME);


const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION
})


module.exports = s3