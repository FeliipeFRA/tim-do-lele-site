// Função para inserir um novo pedido completo no banco de dados SQLite
// Inclui: PEDIDOS, PEDIDOS_ITENS, PEDIDOS_ITENS_MOLHOS

const { ConfigBanco } = require('./config_banco');

/**
 * Insere um pedido completo no banco de dados.
 * @param {number} userId - ID do usuário.
 * @param {Array} itens - Array de itens do carrinho.
 * @param {string} horarioReserva - Horário de reserva do pedido.
 * @returns {Promise<{pedidoId: number, totalPedido: number}>}
 */
async function inserirPedidoCompleto(userId, itens, horarioReserva) {
  return new Promise((resolve, reject) => {
    const db = ConfigBanco();
    db.serialize(() => {
      // 1. Inserir na tabela PEDIDOS
      const dataAtual = new Date().toISOString();
      db.run(
        `INSERT INTO PEDIDOS (USER_ID, DATA, HORARIO_RESERVA, STATUS) VALUES (?, ?, ?, ?)`,
        [userId, dataAtual, horarioReserva, 'Pendente'],
        function (err) {
          if (err) {
            db.close();
            return reject(err);
          }
          const pedidoId = this.lastID;
          let totalPedido = 0;
          let totalMolhosParaInserir = 0;
          let molhosInseridos = 0;
          let itensInseridos = 0;
          if (itens.length === 0) {
            db.close();
            return resolve({ pedidoId, totalPedido });
          }
          itens.forEach((item) => {
            const precoBase = item.PRECO * (item.QUANTITY ?? 1);
            const precoAdd = (item.additionals || []).reduce(
              (soma, add) => soma + add.PRECO * (item.QUANTITY ?? 1),
              0
            );
            totalPedido += precoBase + precoAdd;
            db.run(
              `INSERT INTO PEDIDOS_ITENS (PEDIDO_ID, TIPO, ITEM_ID, QUANTIDADE) VALUES (?, ?, ?, ?)`,
              [pedidoId, item.TIPO, item.ID, item.QUANTITY ?? 1],
              function (err2) {
                if (err2) {
                  db.close();
                  return reject(err2);
                }
                const pedidoItemId = this.lastID;
                const molhos = item.sauces || [];
                if (molhos.length === 0) {
                  itensInseridos++;
                  if (itensInseridos === itens.length && totalMolhosParaInserir === 0) {
                    db.close();
                    resolve({ pedidoId, totalPedido });
                  }
                  return;
                }
                totalMolhosParaInserir += molhos.length;
                molhos.forEach((molhoNome) => {
                  db.get(
                    `SELECT ID FROM MOLHOS WHERE NOME = ?`,
                    [molhoNome],
                    function (errMolho, molhoRow) {
                      if (errMolho || !molhoRow) {
                        molhosInseridos++;
                        if (molhosInseridos === totalMolhosParaInserir && itensInseridos === itens.length) {
                          db.close();
                          resolve({ pedidoId, totalPedido });
                        }
                        return;
                      }
                      db.run(
                        `INSERT INTO PEDIDOS_ITENS_MOLHOS (PEDIDO_ITEM_ID, MOLHO_ID) VALUES (?, ?)`,
                        [pedidoItemId, molhoRow.ID],
                        function (err3) {
                          molhosInseridos++;
                          if (molhosInseridos === totalMolhosParaInserir && itensInseridos === itens.length) {
                            db.close();
                            resolve({ pedidoId, totalPedido });
                          }
                        }
                      );
                    }
                  );
                });
                itensInseridos++;
              }
            );
          });
        }
      );
    });
  });
}

module.exports = { inserirPedidoCompleto };
