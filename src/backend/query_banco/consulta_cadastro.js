const { ConfigBanco } = require('./config_banco.js');

function  ConsultarUsers() {
    // Função responsável por consultar a tabela users
    const db = ConfigBanco();
    
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM USERS', (error, rows) => {  // Removi 'users' daqui
            if (error) {
                console.error("Erro ao consultar a tabela users:", error.message);
                reject(error);
            } else {
                console.log("Elementos da tabela usuarios encontrados com sucesso!", rows);

                // Imprime cada usuário encontrado
                // rows.forEach(user => {
                //     console.log(user);
                // });

                resolve(rows);  // Resolve a promise com as linhas da tabela
                console.log("Registros encontrados:", rows);
            }
        });
    });
}

ConsultarUsers()

module.exports = { ConsultarUsers };
