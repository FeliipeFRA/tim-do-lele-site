// Subrota responsável pelos pagamentos

const express = require('express');

//services
const api_pix = require('../../services/api-pix.js')

app = express();


const router = express.Router()

router.get('/', async (req, res) =>{
    try{
        res.status(200).send("Foi Hein!");
    }
    catch(error){
        res.statusCode.send("Deu ruim", error);
    }
})

router.post('/pix', async (req, res)=>{
    //rota responsável por criar o pix
   
    try{

        // Ler os dados do corpo da requisição
        const { email, nome, sobrenome, cpf, preco } = req.body;

        // Validar se todos os dados foram enviados
        if (!email || !nome || !sobrenome || !cpf || !preco) {
            return res.status(400).json({ error: 'Todos os campos (email, nome, sobrenome, cpf, preco) são obrigatórios' });
        }
    
        // Aqui você pode usar os dados recebidos
        console.log('Dados recebidos do frontend:');
        console.log('Email:', email);
        console.log('Nome:', nome);
        console.log('Sobrenome:', sobrenome);
        console.log('CPF:', cpf);
        console.log('Preço:', preco);


        const pix = await api_pix.realizarPagamentoPix(email, nome, sobrenome, cpf, preco);
        console.log(pix);
        res.status(200).json({
            "message": "Dados recebidos com sucesso!",
            "pix": pix 
        })
    }
    catch(error){
        console.error('Erro ao processar a requisição:', error.message);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
})

module.exports = router;