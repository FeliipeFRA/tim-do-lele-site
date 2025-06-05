// Script para criar a tabela PEDIDOS_ITENS_MOLHOS no banco SQLite
const { ConfigBanco } = require('./config_banco');

function criarTabelaPedidosItensMolhos() {
  const db = ConfigBanco();
  const sql = `
    CREATE TABLE IF NOT EXISTS PEDIDOS_ITENS_MOLHOS (
      PEDIDO_ITEM_ID INTEGER NOT NULL,
      MOLHO_ID INTEGER NOT NULL,
      FOREIGN KEY (PEDIDO_ITEM_ID) REFERENCES PEDIDOS_ITENS(ID),
      FOREIGN KEY (MOLHO_ID) REFERENCES MOLHOS(ID)
    );
  `;
  db.run(sql, (err) => {
    if (err) {
      console.error('Erro ao criar tabela PEDIDOS_ITENS_MOLHOS:', err.message);
    } else {
      console.log('Tabela PEDIDOS_ITENS_MOLHOS criada com sucesso!');
    }
    db.close();
  });
}

criarTabelaPedidosItensMolhos();
