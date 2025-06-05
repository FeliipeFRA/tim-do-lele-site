const { ConfigBanco } = require('./config_banco.js');

function  ConsultarPedidos() {
    // Função responsável por consultar a tabela users
    const db = ConfigBanco();
    
    return new Promise ((resolve, reject) => {
        db.all(`
            SELECT
                P.ID AS PedidoID,
                PI.PEDIDO_ID AS PedidoItemID,
                U.NOME AS NomeUsuario,
                strftime('%d/%m/%Y', P.DATA) AS DataPedido,
                P.HORARIO_RESERVA AS HorarioReserva,
                P.STATUS AS StatusPedido,
                COALESCE(L.NOME, B.NOME) AS NomeLanche,
                PI.QUANTIDADE AS Quantidade,
                PI.TIPO AS TipoItem,
                IFNULL((
                  SELECT GROUP_CONCAT(M.NOME, ', ')
                  FROM PEDIDOS_ITENS_MOLHOS PIM
                  JOIN MOLHOS M ON PIM.MOLHO_ID = M.ID
                  WHERE PIM.PEDIDO_ITEM_ID = PI.ID
                ), '') AS Molhos,
                P.OBSERVACOES AS Observacoes,
                P.ADICIONAIS AS Adicionais
            FROM
                PEDIDOS P
                JOIN USERS U ON P.USER_ID = U.ID
                JOIN PEDIDOS_ITENS PI ON P.ID = PI.PEDIDO_ID
                LEFT JOIN LANCHES L ON (PI.TIPO IN ('CACHORRO-QUENTE','HAMBURGUER','FRANGO','SANDUICHE') AND PI.ITEM_ID = L.ID)
                LEFT JOIN BEBIDAS B ON (PI.TIPO = 'Lata' AND PI.ITEM_ID = B.ID)
            ORDER BY
                P.ID, PI.ID;
        `, (error, rows) => {  
            if (error) {
                console.error("Erro ao consultar a tabela PEDIDOS:", error.message);
                reject(error);
            } else {
                resolve(rows);  // Resolve a promise com as linhas da tabela
            }
        });
    });
}

ConsultarPedidos()

module.exports = { ConsultarPedidos };
