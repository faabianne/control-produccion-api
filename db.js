// 1. Cargamos la librería dotenv para leer las variables secretas del archivo .env
require('dotenv').config();

// 2. Importamos el objeto Pool desde la librería 'pg' (PostgreSQL)
const { Pool } = require('pg');

// 3. Creamos una "piscina" (Pool) de conexiones reutilizables usando los datos del archivo .env
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// 4. Exportamos este módulo para poder usarlo en otras partes de nuestra aplicación
module.exports = pool;
