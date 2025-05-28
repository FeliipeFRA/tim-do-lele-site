const  { ConfigBanco } = require('./config_banco')


async function InserirLanche(nome, preco){
    //Função Responsável por Inserir os dados de acesso do usuário na tabela
    const db = ConfigBanco();

    sqlInsert = `INSERT INTO LANCHES (NOME, PRECO) VALUES(?,?) `;
    db.run(sqlInsert, [nome, preco], function(err) {
        if (err) {
            console.error('Erro ao inserir dados: ' + err.message);
        } else {
            console.log(`Um registro de lanche inserido com ID ${this.lastID}`);
        }
    });

    //Fechar o banco
    db.close(() =>{
        try {
            console.log("Banco fechado com sucesso!")
        }
        catch(error){
            console.log("Erro ao fechar o banco!", error)
        }
    }) 
}

InserirLanche('X-Frango Catupiry', 22)