// Módulo responsável por inserir pedidos e itens no banco de dados
const { ConfigBanco } = require('./config_banco.js');

async function InserirPedido(userId, horarioReserva, itens) {
    const db = ConfigBanco();
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO PEDIDOS (USER_ID, DATA, HORARIO_RESERVA, STATUS) VALUES (?, date('now'), ?, 'PENDENTE')`,
            [userId, horarioReserva],
            function (err) {
                if (err) {
                    db.close();
                    return reject(err);
                }
                const pedidoId = this.lastID;
                // Inserir itens do pedido
                let erroItem = null;
                let inseridos = 0;
                if (!itens || itens.length === 0) {
                    db.close();
                    return resolve(pedidoId);
                }
                itens.forEach((item) => {
                    db.run(
                        `INSERT INTO PEDIDOS_ITENS (PEDIDO_ID, TIPO, ITEM_ID, QUANTIDADE, PARENT_ITEM_ID) VALUES (?, ?, ?, ?, ?)`,
                        [pedidoId, item.tipo, item.itemId, item.quantidade, item.parentItemId || null],
                        function (err2) {
                            if (err2) {
                                console.error('Erro ao inserir item em PEDIDOS_ITENS:', err2.message, 'Dados:', {
                                    pedidoId,
                                    tipo: item.tipo,
                                    itemId: item.itemId,
                                    quantidade: item.quantidade,
                                    parentItemId: item.parentItemId || null
                                });
                            }
                            inseridos++;
                            if (err2 && !erroItem) erroItem = err2;
                            if (inseridos === itens.length) {
                                db.close();
                                if (erroItem) return reject(erroItem);
                                resolve(pedidoId);
                            }
                        }
                    );
                });
            }
        );
    });
}

module.exports = { InserirPedido };
