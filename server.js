const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ============ GET - Obtener todos los contactos ============
app.get('/api/contacts', (req, res) => {
    db.all('SELECT * FROM contacts ORDER BY id DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// ============ POST - Crear nuevo contacto ============
app.post('/api/contacts', (req, res) => {
    const { nombre, apellido, telefono, ciudad, direccion, genero } = req.body;
    
    db.run(
        `INSERT INTO contacts (nombre, apellido, telefono, ciudad, direccion, genero)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, telefono, ciudad, direccion, genero],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({
                id: this.lastID,
                nombre,
                apellido,
                telefono,
                ciudad,
                direccion,
                genero
            });
        }
    );
});

// ============ PUT - Actualizar contacto ============
app.put('/api/contacts/:id', (req, res) => {
    const { nombre, apellido, telefono, ciudad, direccion, genero } = req.body;
    const { id } = req.params;
    
    db.run(
        `UPDATE contacts 
         SET nombre = ?, apellido = ?, telefono = ?, ciudad = ?, direccion = ?, genero = ?
         WHERE id = ?`,
        [nombre, apellido, telefono, ciudad, direccion, genero, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ message: 'Contacto no encontrado' });
                return;
            }
            res.json({ id: parseInt(id), nombre, apellido, telefono, ciudad, direccion, genero });
        }
    );
});

// ============ DELETE - Eliminar contacto ============
app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    
    db.run(`DELETE FROM contacts WHERE id = ?`, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Contacto no encontrado' });
            return;
        }
        res.json({ message: 'Contacto eliminado' });
    });
});

// ============ Iniciar servidor ============
const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
    console.log(` Base de datos SQLite: contacts.db`);
});