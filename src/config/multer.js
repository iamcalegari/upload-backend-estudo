const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

/*

const storageS3 = new aws.S3({
    accessKeyId: '...',
    secretAccessKey,
});

*/

const storageTypes = {              // vamos ter dois tipos de storage
    local: multer.diskStorage({     // para ambiente de desenvolvimento
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, file.key);
            });
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),           // s3 é uma variavel obrigatoria
        bucket: 'uploadalan',
        contentType: multerS3.AUTO_CONTENT_TYPE, // para fazer com que o navegador tente exibir o conteudo do arquivo e nao faça o download do mesmo
        acl: 'public-read',         // permissao para leitura publica
        key: (req, file, cb) => {   // mesma coisa do filename no diskstorage
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                const fileName = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, fileName);
            });
        },
    }),

};

/*
    Variáveis ambiente: sao variaveis que vao se comportar de diferentes
    formas dependendo do nosso ambiente que estamos usando.
    Esse arquivo que vai fazer o controle da variavel de ambiente nao vai
    ficar disponivel no controle de versão, ou seja, nao vai ficar disponivel
    para o usuario final. Vai ficar disponivel apenas no nosso ambiente
    de desenvolvimento, nossas chaves e credenciais, nao vai ficar disponivel
    no ambiente de produção. 
    arquivo .env sera o arquivo utilizado para isso.
    yarn add dotenv -> para instalar a biblioteca para que o node leia o 
    arquivo .env

*/


module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),  // __dirname se refere ao diretorio que o arquivo se encontra
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
};
