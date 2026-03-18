const { Pool } = require('pg');
const fs = require('fs');

// melakukan konfigurasi ke database di laptop (local)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_tes',
    password: 'postgres',
    port: 5432,
});

async function runSeeder() {
    try {
        console.log("Membaca file viewData.json...");
        const rawData = fs.readFileSync('./viewData.json', 'utf-8');
        const parsedData = JSON.parse(rawData);

        // 1. Insert Data Status
        console.log("Menanam data status_reference...");
        for (const item of parsedData.status) {
            const queryStatus = `
                INSERT INTO status_reference (id, name) 
                VALUES ($1, $2) 
                ON CONFLICT (id) DO NOTHING
            `;
            await pool.query(queryStatus, [item.id, item.name]);
        }

        // memasukkan data (seeding)
        console.log("Menanam data transactions...");
        for (const item of parsedData.data) {
            const queryTransactions = `
                INSERT INTO transactions (id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (id) DO NOTHING
            `;
            // amount dikonversi ke Number agar sesuai dengan tipe data INT di database
            const values = [
                item.id, 
                item.productID, 
                item.productName, 
                Number(item.amount), 
                item.customerName, 
                item.status, 
                item.transactionDate, 
                item.createBy, 
                item.createOn
            ];
            await pool.query(queryTransactions, values);
        }
        
        console.log("Seeding selesai dengan sukses!");
    } catch (error) {
        console.error("Gagal melakukan seeding:", error);
    } finally {
        pool.end();
    }
}

runSeeder();