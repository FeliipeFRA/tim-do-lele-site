// Módulo responsável por configurar as rotas da API
const express = require('express');
const cors = require('cors')
const { ConsultarUsers } = require('./query_banco/consulta_cadastro.js');
const {InserirUser} = require('./query_banco/inserir_cadastro.js')
const {ConsultarLanches} = require('./query_banco/consulta_lanches.js')
const {ConsultarPedidos} = require('./query_banco/consulta_pedidos.js')

//módulo de configuração do banco de dados
const {ConfigBanco} = require('./query_banco/config_banco.js')


//criptografia da senha
const {CriptografarSenha} = require('./cipher.js')

//validação de login
const passport = require('./passport-config.js')

const app = express();

const PORT = 8000;


app.use(cors({
    // Cors serve para conectar portas diferentes
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));
  
// Middleware para interpretar JSON
app.use(express.json());

// Função para validar e-mails com domínios específicos
function validarEmail(email) {
    const dominiosPermitidos = ['gmail.com', '@baraodemaua.edu.br', 'hotmail.com', 'yahoo.com', 'yahoo.com.br', 'icloud.com', 'outlook.com', 'aol.com'];

    const padraoEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (padraoEmail.test(email)) {
        const dominio = email.split('@')[1];
        return dominiosPermitidos.includes(dominio);
    }
    return false;
}

app.get('/consulta-users', async (req, res) => {
    //Endpoint responsável por consultar users
    try {
        const users = await ConsultarUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao consultar a tabela users:", error);
        res.status(500).send("Erro ao consultar a tabela users.");
    }
});

app.get('/lanches', async (req, res)=>{
    try {
        const lanches = await ConsultarLanches();
        res.status(200).json(lanches);
    }
    catch(erro){

    }
})


app.post('/autenticar-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = ConfigBanco();
        console.log(email)
        console.log(password)   

        // Criptografa a senha recebida
        const senhaCriptografada = await CriptografarSenha(password);

        // Consulta o banco para verificar o usuário e senha
        db.get('SELECT * FROM USERS WHERE EMAIL = ?', [email], (err, user) => {
            if (err) {
                console.error("Erro ao consultar o banco de dados:", err);
                return res.status(500).send({ message: "Erro no servidor." });
            }
            if (!user) {
                return res.status(401).send({ message: "Usuário não encontrado." });
            }

            // Compara a senha criptografada com a coluna SENHA
            if (user.SENHA !== senhaCriptografada) {
                return res.status(401).send({ message: "Senha incorreta." });
            }

            // Login bem-sucedido
            res.status(200).send({ message: "Login bem-sucedido!" });
        });

        db.close();
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(400).send({ message: "Erro ao realizar o login." });
    }
});



app.post('/enviar-cadastro', async (req, res) => {
    try {
        const data = req.body;

        // Valida o e-maill com o=domínios permitidos
        if (!validarEmail(data.email)) {
            return res.status(400).send({ message: "E-mail inválido." });
        }
        
        // Criptografa a senha do user
        let senhaCriptografada;
        try {
            senhaCriptografada = await CriptografarSenha(data.senha);
        } catch (erroCripto) {
            console.error("Erro ao criptografar senha:", erroCripto);
            return res.status(500).send({ message: "Erro na criptografia da senha." });
        }

        await InserirUser(data.email, data.nome, senhaCriptografada, data.telefone);
        res.status(200).json({ message: "Dados enviados com sucesso." });
    } catch (erro) {
        console.error("Erro ao enviar cadastro:", erro);
        res.status(500).send({ message: "Falha ao enviar os dados." });
    }
});


app.get('/pedidos', async (req, res) => {
    //Endpoint responsável pelos pedidos
    try{
        const pedidos = await ConsultarPedidos();
        res.status(200).json(pedidos);
    }
    catch(erro){
        console.error("Erro ao consultar a tabela pedidos:", erro);
        res.status(500).send("Erro ao consultar a tabela pedidos.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

});
