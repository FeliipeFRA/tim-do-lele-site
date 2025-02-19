var sqlite3 = require('sqlite3');

function createDatabase() {
    var newdb = new sqlite3.Database('TIM_DO_LELE.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            process.exit(1); // Corrigido para 'process.exit(1)'
        }
        createTables(newdb);
    });
}

function createTables(db) {
    // Aqui você pode definir a lógica para criar suas tabelas
}

createDatabase();
