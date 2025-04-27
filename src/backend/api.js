// Módulo responsável por configurar as rotas da API
const express = require('express');
const cors = require('cors')
const { ConsultarUsers } = require('./query_banco/consulta_cadastro.js');
const {InserirUser} = require('./query_banco/inserir_cadastro.js')
const {ConsultarLanches} = require('./query_banco/consulta_lanches.js')
const {ConsultarPedidos} = require('./query_banco/consulta_pedidos.js')
const { verificarEmailExistenteNoBanco } = require('./query_banco/verificar_email.js');


//rota de pagamentos
const pagamento = require('./routes/pagamentos/pagamento.js');

//módulo de configuração do banco de dados
const {ConfigBanco} = require('./query_banco/config_banco.js')

//criptografia da senha
const {CriptografarSenha} = require('./services/cipher.js')

//validação de login
const passport = require('./services/passport-config.js')

const app = express();

//api pagamentos
app.use('/pagamento', pagamento);

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
    const dominiosPermitidos = ['gmail.com', 'baraodemaua.edu.br', 'hotmail.com', 'yahoo.com', 'yahoo.com.br', 'icloud.com', 'outlook.com', 'aol.com', 'msn.com', 'live.com', 'uol.com.br', 'terra.com.br', 'bol.com.br', 'ig.com.br', 'r7.com'];

    const padraoEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (padraoEmail.test(email)) {
        const dominio = email.split('@')[1];
        return dominiosPermitidos.includes(dominio);
    }
    return false;
}

// Função para validar número de telefone brasileiro
// O formato esperado é: +55 (XX) XXXXX-XXXX
// Função de validação do número de telefone
function validarTelefone(telefone) {
    // Expressão regular para validar números de telefone em diversos formatos
    const padraoTelefone = /^(?:\(?\d{2}\)?\s?)?(?:9\d{4}[-\s]?\d{4}|\d{4}[-\s]?\d{4})$/;

    return padraoTelefone.test(telefone);
}

// Função para verificar email duplicado
async function verificarEmailExistente(email) {
    try {
        const emailExistente = await verificarEmailExistenteNoBanco(email);
        return emailExistente; // Retorna se o email já existe ou não
    } catch (error) {
        console.error("Erro ao verificar email:", error);
        throw new Error("Erro ao verificar email.");
    }
} 

// Função para verificar telefone duplicado
async function verificarTelefoneExistente(telefone) {
    const telefoneExistente = await ConsultarUsers(telefone);
    return telefoneExistente !== null;
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

  // Verificação de email duplicado
async function verificarEmailExistente(email) {
    const emailExistente = await verificarEmailExistenteNoBanco(email); // Chama a função de consulta específica
    return emailExistente; // Retorna se o email já existe ou não
}

app.post('/enviar-cadastro', async (req, res) => {
    try {
        const { email, nome, senha, telefone } = req.body;

        // Validação de campos obrigatórios
        if (!email || !nome || !senha || !telefone) {
            return res.status(400).send({ message: "Todos os campos são obrigatórios." });
        }

        // Validação de email
        if (!validarEmail(email)) {
            return res.status(400).send({ message: "E-mail inválido." });
        }

        const emailExistente = await verificarEmailExistente(email); // Aqui estamos chamando a função
        if (emailExistente) {
            return res.status(400).send({ message: "Este e-mail já está cadastrado." });
        }

        // Validação de telefone
        if (!validarTelefone(telefone)) {
            return res.status(400).send({ message: "Número de telefone inválido." });
        }

        // Verificação de telefone duplicado
        const telefoneExistente = await verificarTelefoneExistente(telefone);
        if (telefoneExistente) {
            return res.status(400).send({ message: "Este telefone já está cadastrado." });
        }

        // Criptografar a senha
        const senhaCriptografada = await CriptografarSenha(senha);

        // Inserir no banco de dados
        await InserirUser(email, nome, senhaCriptografada, telefone);

        // Enviar resposta de sucesso
        res.status(200).json({ message: "Cadastro realizado com sucesso!" });

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

app.post('/pagamentos/pix', async (req, res) =>{
    try{

    }
    catch(error){

    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
