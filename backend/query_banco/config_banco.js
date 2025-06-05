//Arquivo responsável pelas configurações do banco

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function ConfigBanco() {
    // Caminho absoluto para a raiz do projeto
    const dbPath = path.resolve(__dirname, '../../TIM-DO-LELE.db');
    return new sqlite3.Database(dbPath, (error) => {
        if (error) {
            console.error("Erro ao conectar ao banco TIM-DO-LELE:", error.message);
        } else {
            console.log("Conectado ao banco TIM-DO-LELE com sucesso!");
        }
    });
}

module.exports = { ConfigBanco };
