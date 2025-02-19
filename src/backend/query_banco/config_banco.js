//Arquivo responsável pelas configurações do banco

const sqlite3 = require('sqlite3').verbose();

function ConfigBanco() {
    return new sqlite3.Database('./TIM-DO-LELE.db', (error) => {
        if (error) {
            console.error("Erro ao conectar ao banco TIM-DO-LELE:", error.message);
        } else {
            console.log("Conectado ao banco TIM-DO-LELE com sucesso!");
        }
    });
}

module.exports = { ConfigBanco };
