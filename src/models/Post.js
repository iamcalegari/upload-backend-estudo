// representação da nossa tabela, no caso nosso banco é nao relacional

const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
    name: String,   // nome original da imagem
    size: Number,   // tamanho da imagem
    key: String,    // hash gerado no nome da imagem
    url: String,    // para a amazon s3 
    createdAt: {
        type: Date,
        default: Date.now,  // data atual que o post foi criado
    },
});

PostSchema.pre('save', function () {
    if (!this.url) {
        this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
});

PostSchema.pre('remove', function () {
    if (process.env.STORAGE_TYPE == 's3') {
        return s3.deleteObject({
            Bucket: 'uploadalan',
            Key: this.key,
        }).promise()
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key));
    }
});

module.exports = mongoose.model("Post", PostSchema);