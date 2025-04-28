const { ConfigBanco } = require('./config_banco.js');

function  ConsultarLanches() {
    // Função responsável por consultar a tabela users
    const db = ConfigBanco();
    
    return new Promise ((resolve, reject) => {
        db.all('SELECT * FROM LANCHES', (error, rows) => {  
            if (error) {
                console.error("Erro ao consultar a tabela lanches:", error.message);
                reject(error);
            } else {
                console.log("Elementos da tabela lanches encontrados com sucesso!", rows);

                // Imprime cada usuário encontrado
                rows.forEach(lanche => {
                    console.log(lanche);
                });

                resolve(rows);  // Resolve a promise com as linhas da tabela
                console.log("Registros encontrados:", rows);
            }
        });
    });
}

ConsultarLanches()

module.exports = { ConsultarLanches };
