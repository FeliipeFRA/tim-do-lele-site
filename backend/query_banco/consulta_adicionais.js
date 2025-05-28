const { ConfigBanco } = require('./config_banco.js');

function  ConsultarAdicionais() {
    // Função responsável por consultar a tabela users
    const db = ConfigBanco();
    
    return new Promise ((resolve, reject) => {
        db.all('SELECT * FROM ADICIONAIS', (error, rows) => {  
            if (error) {
                console.error("Erro ao consultar a tabela adicionais:", error.message);
                reject(error);
            } else {
                console.log("Elementos da tabela adicionais encontrados com sucesso!", rows);
                resolve(rows);  // Resolve a promise com as linhas da tabela
            }
        });
    });
}

ConsultarAdicionais()

module.exports = { ConsultarAdicionais };
