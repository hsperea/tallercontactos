const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear/Conectar a la base de datos (se crea automáticamente)
const db = new sqlite3.Database(path.join(__dirname, 'contacts.db'));

// Crear la tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        telefono TEXT NOT NULL,
        ciudad TEXT NOT NULL,
        direccion TEXT NOT NULL,
        genero TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creando tabla:', err);
    } else {
        console.log(' Base de datos SQLite lista');
    }
});

module.exports = db;