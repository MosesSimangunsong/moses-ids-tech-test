const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar bisa menerima body JSON dari frontend

// Koneksi Database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_tes',
    password: 'postgres',
    port: 5432,
});

//membuat endpoint untuk API nya

// get untuk mengambil semua data
app.get('/api/transactions', async (req, res) => {
    try {
        const query = `
            SELECT t.*, s.name as status_name 
            FROM transactions t 
            JOIN status_reference s ON t.status = s.id
            ORDER BY t.transactionDate DESC
        `;
        const result = await pool.query(query);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// get tapi untuk mengambil berdasarkan id
app.get('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT t.*, s.name as status_name 
            FROM transactions t 
            JOIN status_reference s ON t.status = s.id 
            WHERE t.id = $1
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// post untuk menambah data baru
app.post('/api/transactions', async (req, res) => {
    try {
        const { id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn } = req.body;
        
        const query = `
            INSERT INTO transactions (id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;
        const values = [id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn];
        
        const result = await pool.query(query, values);
        res.status(201).json({ success: true, message: "Data berhasil ditambahkan", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// put untuk memodifikasi data yang sudah ada
app.put('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { productID, productName, amount, customerName, status, transactionDate } = req.body;
        
        const query = `
            UPDATE transactions 
            SET productID = $1, productName = $2, amount = $3, customerName = $4, status = $5, transactionDate = $6
            WHERE id = $7 RETURNING *
        `;
        const values = [productID, productName, amount, customerName, status, transactionDate, id];
        
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
        }
        res.json({ success: true, message: "Data berhasil diubah", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// menjalankan server
app.listen(port, () => {
    console.log(`Backend server berjalan di http://localhost:${port}`);
});
