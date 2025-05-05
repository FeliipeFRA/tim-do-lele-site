const { ConfigBanco } = require('./config_banco.js');

// Função para consultar todos os usuários
function ConsultarUsers() {
    const db = ConfigBanco();

    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM USERS', (error, rows) => {
            if (error) {
                console.error("Erro ao consultar a tabela users:", error.message);
                reject(error);
            } else {
                console.log("Elementos da tabela usuarios encontrados com sucesso!", rows);
                resolve(rows);
            }
        });
    });
}

// Exportar ambas as funções
module.exports = { ConsultarUsers};
