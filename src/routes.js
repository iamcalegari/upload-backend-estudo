// esse arquivo sera para armazenar as rotas de forma separada

const routes = require('express').Router();
const multer = require('multer');               // requisiçoes carregando arquivo
const multerConfig = require("./config/multer");

const Post = require('./models/Post');

routes.get('/posts', async (req, res) => {
    const posts = await Post.find();

    return res.json(posts);
});

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {        // definindo a primeira rota
    const { originalname: name, size, key, location: url = '' } = req.file; // desestruturação para nao precisar escrever toda hora req.file.<algumacoisa>

    const post = await Post.create({        // criando um novo registro na base de dados utilizando mongoose
        name,
        size,
        key,
        url
    });

    return res.json(post);
});

routes.delete('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);

    await post.remove();

    return res.send();
});


// vamos trocar o res.send por res.json para utilizar a formatação json
// ja que vamos utilizar um serviço http com padrao restful, que transmita
// informação entre o back e front pelo padrao json (JavaScript Object Notation)

module.exports = routes;                    // para exportar as rotas contidas
                                            // nesse arquivo