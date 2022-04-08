require('dotenv').config();             // vai fazer com que nosso arquivo do node
// leia as variaveis de dentro de .env    

const express = require('express');     // importar o express
const morgan = require('morgan');       // log de requisiçoes http
const mongoose = require('mongoose');   // manipular o banco de dados
const path = require('path');

const app = express();                  // instanciando o servidor express

// Database setup
mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,          // padrao para a conf do mongodb
    }
);

app.use(express.json());                // agora o express vai conseguir lidar com o formato tipo json 
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))); // liberamos o acesso a arquivos estaticos

app.use(require("./routes"));

app.listen(3000);                       // servidor começar a ouvir a porta 3000
