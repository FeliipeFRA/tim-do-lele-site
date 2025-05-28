const { ConfigBanco } = require('./config_banco.js');

// Função para verificar se o email existe no banco
function verificarEmailExistenteNoBanco(email) {
    const db = ConfigBanco();

    return new Promise((resolve, reject) => {
        db.get('SELECT 1 FROM USERS WHERE EMAIL = ? LIMIT 1', [email], (error, row) => {
            if (error) {
                console.error("Erro ao consultar a tabela users:", error.message);
                reject(error);
            } else {
                // Se row for null ou undefined, o email não existe
                resolve(row !== undefined && row !== null);
            }
        });
    });
}

// Exportar ambas as funções
module.exports = { verificarEmailExistenteNoBanco };
