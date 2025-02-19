const { ConfigBanco } = require('./config_banco.js');

function ConsultarPedidos() {
    // Função responsável por consultar os pedidos
    const db = ConfigBanco();

    return new Promise((resolve, reject) => {
        db.all(`
                SELECT
            P.ID AS PedidoID,
            U.NOME AS NomeUsuario,
            P.DATA AS DataPedido,
            P.HORARIO_RESERVA AS HorarioReserva,
            P.STATUS AS StatusPedido,
            CASE
                WHEN PI.TIPO = 'Lanche' THEN L.NOME
                WHEN PI.TIPO = 'Bebida' THEN B.NOME
                ELSE NULL
            END AS NomeItem,
            PI.QUANTIDADE AS Quantidade,
            CASE
                WHEN PI.TIPO = 'Lanche' THEN (
                    SELECT GROUP_CONCAT(M2.NOME, ', ')
                    FROM PEDIDOS_ITENS PI2
                    JOIN MOLHOS M2 ON PI2.ITEM_ID = M2.ID
                    WHERE PI2.PEDIDO_ID = P.ID AND PI2.TIPO = 'Molho'
                )
                ELSE NULL
            END AS Molhos
        FROM
            PEDIDOS P
            JOIN USERS U ON P.USER_ID = U.ID
            JOIN PEDIDOS_ITENS PI ON P.ID = PI.PEDIDO_ID
            LEFT JOIN LANCHES L ON PI.ITEM_ID = L.ID AND PI.TIPO = 'Lanche'
            LEFT JOIN BEBIDAS B ON PI.ITEM_ID = B.ID AND PI.TIPO = 'Bebida'
        WHERE
            PI.TIPO != 'Molho'
        ORDER BY
            P.ID, PI.ID;
        `, (error, rows) => {  
            if (error) {
                console.error("Erro ao consultar a tabela PEDIDOS:", error.message);
                reject(error);
            } else {
                console.log("Pedidos encontrados com sucesso!");
                
                // Exibindo todos os resultados no console
                rows.forEach((row, index) => {
                    console.log(`Pedido ${index + 1}:`);
                    console.log(`ID: ${row.PedidoID}`);
                    console.log(`Usuário: ${row.NomeUsuario}`);
                    console.log(`Data: ${row.DataPedido}`);
                    console.log(`Horário Reserva: ${row.HorarioReserva}`);
                    console.log(`Status: ${row.StatusPedido}`);
                    console.log(`Item: ${row.NomeItem}`);
                    console.log(`Quantidade: ${row.Quantidade}`);
                    console.log(`Molhos: ${row.Molhos || 'Sem molhos'}`);
                    console.log('---');
                });

                // Resolve a Promise com todos os pedidos
                resolve(rows);
            }
        });
    });
}

// Chamando a função e exibindo os resultados
ConsultarPedidos()
    .then((pedidos) => {
        console.log('Todos os pedidos recuperados com sucesso!');
        console.log(pedidos); // Exibe o array completo com todos os pedidos
    })
    .catch((error) => {
        console.error('Erro ao recuperar os pedidos:', error);
    });

module.exports = { ConsultarPedidos };
