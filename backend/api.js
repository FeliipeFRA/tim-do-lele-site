// Módulo responsável por configurar as rotas da API
const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path');

const {ConsultarUsers } = require('./query_banco/consulta_cadastro.js');
const {InserirUser} = require('./query_banco/inserir_cadastro.js')
const {ConsultarLanches} = require('./query_banco/consulta_lanches.js')
const {ConsultarBebidas } = require('./query_banco/consulta_bebidas.js');
const {ConsultarPedidos} = require('./query_banco/consulta_pedidos.js')
const {ConsultarAdicionais} = require('./query_banco/consulta_adicionais.js')
const {verificarEmailExistenteNoBanco } = require('./query_banco/verificar_email.js');
const { buscarOverrideNoBanco, salvarOverrideNoBanco } = require('./query_banco/configuracoes.js');

//rota de pagamentos
const pagamento = require('./routes/pagamentos/pagamento.js');

//módulo de configuração do banco de dados
const {ConfigBanco} = require('./query_banco/config_banco.js')

//criptografia da senha
const {CriptografarSenha} = require('./services/cipher.js')

//validação de login
const passport = require('./services/passport-config.js')

const horariosPadrao = [
  { inicio: "19:00", fim: "20:00" },
  { inicio: "21:30", fim: "22:00" }
];


//api pagamentos
app.use('/pagamento', pagamento);

const PORT = process.env.PORT || 8000;


app.use(cors({
    // Cors serve para conectar portas diferentes
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','x-user-role'], 
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

function estaNoIntervalo(agora, inicio, fim) {
  const [hI, mI] = inicio.split(':').map(Number);
  const [hF, mF] = fim.split(':').map(Number);
  const inicioDate = new Date(agora);
  inicioDate.setHours(hI, mI, 0, 0);
  const fimDate = new Date(agora);
  fimDate.setHours(hF, mF, 0, 0);

  return agora >= inicioDate && agora <= fimDate;
}

function autenticarUsuario(req, res, next) {
  const role = req.headers['x-user-role']; // exemplo simples
  if (!role) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  req.user = { role };
  next();
}

function verificaAdmin(req, res, next) {
  if (req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Acesso negado: Admins somente' });
}


app.get('/api/hora-servidor', (req, res) => {
  const agora = new Date();
  res.json({ horaServidor: agora.toString(), iso: agora.toISOString() });
});

app.get('/api/site-status', async (req, res) => {
  try {
    const override = await buscarOverrideNoBanco();
    const agora = new Date();
    console.log('Hora do servidor:', agora.toString());
    console.log('Override:', override);

    if (override !== null) {
      console.log('Status: override admin', override);
      return res.json({ aberto: override, motivo: 'override admin' });
    }

    const abertoAgora = horariosPadrao.some(h => estaNoIntervalo(agora, h.inicio, h.fim));
    console.log('Status: horário padrão', abertoAgora);
    res.json({ aberto: abertoAgora, motivo: 'horário padrão' });
  } catch (error) {
    console.error('Erro ao buscar status:', error);
    res.status(500).json({ message: 'Erro ao buscar status' });
  }
});

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

app.get('/bebidas', async (req, res) => {
    try {
        const bebidas = await ConsultarBebidas();
        res.status(200).json(bebidas);
    } catch (error) {

    }
});

app.get('/adicionais', async (req, res) => {
    try {
        const adicionais = await ConsultarAdicionais();
        res.status(200).json(adicionais);
    } catch (error) {

    }
});

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
                return res.status(401).send({ message: "Usuário não cadastrado." });
            }

            // Compara a senha criptografada com a coluna SENHA
            if (user.SENHA !== senhaCriptografada) {
                return res.status(401).send({ message: "Senha incorreta." });
            }

            // Login bem-sucedido
            res.status(200).send({ 
                message: "Login bem-sucedido!", 
                userId: user.ID, // Retorna o ID do usuário
                role: user.NIVELUSER // Retorna o papel do usuário (admin ou user)
            });
            
        });

        db.close();
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(400).send({ message: "Erro ao realizar o login." });
    }
});

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

        // Validação de telefone
        if (!validarTelefone(telefone)) {
            return res.status(400).send({ message: "Número de telefone inválido." });
        }

        // Verificar se o email já existe no banco
        let emailExistente;
        try {
            emailExistente = await verificarEmailExistenteNoBanco(email);
        } catch (error) {
            console.error("Erro ao verificar se o e-mail existe:", error);
            return res.status(500).send({ message: "Erro ao verificar e-mail no banco." });
        }

        if (emailExistente) {
            return res.status(400).send({ message: "E-mail já cadastrado." });
        }

        // Criptografar a senha
        const senhaCriptografada = await CriptografarSenha(senha);

        // Inserir no banco de dados
        console.log('Inserindo usuário:', email, nome, telefone);
        const userId = await InserirUser(email, nome, senhaCriptografada, telefone);
        if (!userId) {
            return res.status(500).send({ message: "Erro ao obter o ID do usuário." });
        }
        
        console.log(`ID do usuário inserido: ${userId}`);  // Verificando se o ID foi retornado


        // Enviar resposta de sucesso
        res.status(200).json({ message: "Cadastro realizado com sucesso!",
            userId: userId, // Retorna o ID do usuário
            role: 'user' // Retorna o role (pode ser 'user' ou 'admin', dependendo da sua lógica)
         });


    } catch (erro) {
        console.error("Erro ao enviar cadastro:", erro);
        res.status(500).send({ message: erro.message});
    }
});

app.post('/api/site-status', autenticarUsuario, verificaAdmin, async (req, res) => {
  const { aberto } = req.body; // true, false ou null
console.log('Requisição POST /api/site-status body:', req.body);
  if (aberto !== true && aberto !== false && aberto !== null) {
    return res.status(400).json({ message: 'Valor inválido para aberto. Use true, false ou null.' });
  }

  try {
    const valorStr = aberto === null ? 'null' : aberto.toString();
    await salvarOverrideNoBanco(valorStr);
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar override:', error);
    res.status(500).json({ message: 'Erro ao salvar override' });
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

// Frontend
app.use(express.static(path.join(__dirname, 'public', 'browser')));
app.get('*angular', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/browser', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
