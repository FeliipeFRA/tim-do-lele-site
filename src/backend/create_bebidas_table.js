// Script para garantir que a tabela BEBIDAS existe no banco usado pelo backend
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./TIM-DO-LELE.db');

db.run(`CREATE TABLE IF NOT EXISTS BEBIDAS (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  NOME TEXT NOT NULL,
  TIPO TEXT NOT NULL,
  PRECO REAL NOT NULL
);`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela BEBIDAS:', err.message);
  } else {
    console.log('Tabela BEBIDAS garantida no banco.');
  }
  db.close();
});
