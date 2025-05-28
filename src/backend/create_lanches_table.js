// Script para garantir que a tabela LANCHES existe no banco usado pelo backend
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./TIM-DO-LELE.db');

db.run(`CREATE TABLE IF NOT EXISTS LANCHES (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  NOME TEXT NOT NULL,
  TIPO TEXT NOT NULL,
  PRECO REAL NOT NULL
);`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela LANCHES:', err.message);
  } else {
    console.log('Tabela LANCHES garantida no banco.');
  }
  db.close();
});
