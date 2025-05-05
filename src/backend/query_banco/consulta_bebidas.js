const { ConfigBanco } = require('./config_banco.js');

function  ConsultarBebidas() {
    // Função responsável por consultar a tabela users
    const db = ConfigBanco();
    
    return new Promise ((resolve, reject) => {
        db.all('SELECT * FROM BEBIDAS', (error, rows) => {  
            if (error) {
                console.error("Erro ao consultar a tabela bebidas:", error.message);
                reject(error);
            } else {
                console.log("Elementos da tabela bebidas encontrados com sucesso!", rows);
                resolve(rows);  // Resolve a promise com as linhas da tabela
            }
        });
    });
}

ConsultarBebidas()

module.exports = { ConsultarBebidas};
