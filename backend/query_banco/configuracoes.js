const { ConfigBanco } = require('../query_banco/config_banco.js');

function buscarOverrideNoBanco() {
  const db = ConfigBanco();
  return new Promise((resolve, reject) => {
    db.get("SELECT valor FROM Configuracoes WHERE chave = 'site_aberto'", (err, row) => {
      db.close();
      if (err) return reject(err);
      if (!row) return resolve(null);
      if (row.valor === 'null') return resolve(null);
      if (row.valor === 'true') return resolve(true);
      if (row.valor === 'false') return resolve(false);
      resolve(null);
    });
  });
}

function salvarOverrideNoBanco(valor) {
  // valor deve ser string 'true', 'false' ou 'null'
  const db = ConfigBanco();
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Configuracoes (chave, valor) VALUES ('site_aberto', ?) ON CONFLICT(chave) DO UPDATE SET valor=excluded.valor",
      [valor],
      function(err) {
        db.close();
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
}

module.exports = { buscarOverrideNoBanco, salvarOverrideNoBanco };
