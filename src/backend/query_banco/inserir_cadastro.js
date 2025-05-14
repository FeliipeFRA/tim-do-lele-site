// módulo responsável por inserir cadastros no banco de dados
const { ConfigBanco } = require('./config_banco.js');

async function InserirUser(email, nome, senha, telefone) {
    // Função Responsável por Inserir os dados de acesso do usuário na tabela
    const db = ConfigBanco();

    const sqlInsert = `INSERT INTO USERS (EMAIL, NOME, SENHA, TELEFONE) VALUES (?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.run(sqlInsert, [email, nome, senha, telefone], function (err) {
            if (err) {
                console.error('Erro ao inserir dados: ' + err.message);
                return reject(err); // Rejeitar a Promise em caso de erro
            } else {
                console.log(`Um registro inserido com ID ${this.lastID}`);
                // Resolver a Promise com o ID do registro inserido
                resolve(this.lastID);
            }
        });
    })
    .finally(() => {
        // Fechar o banco de dados após a Promise ser resolvida ou rejeitada
        db.close((error) => {
            if (error) {
                console.log("Erro ao fechar o banco!", error);
            } else {
                console.log("Banco fechado com sucesso!");
            }
        });
    });
}

module.exports = { InserirUser };
