const mysql = require('mysql2/promise');

async function run() {
  try {
    const connection = await mysql.createConnection({ 
      host: '127.0.0.1', 
      user: 'root', 
      password: 'Kirti0!3@5$' 
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS expense_system;');
    console.log('Successfully created new database: expense_system');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create database:', err);
    process.exit(1);
  }
}

run();
