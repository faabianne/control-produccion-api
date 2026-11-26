// 1. Importamos Express para levantar el servidor y Cors para permitir peticiones web
const express = require('express');
const cors = require('cors');

// 2. Importamos la conexión a la base de datos que creamos en el paso anterior
const pool = require('./db');

// 3. Inicializamos la aplicación de Express
const app = express();

// 4. Configuramos middlewares: express.json() para leer datos en formato JSON y cors() para seguridad de accesos
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 5. RUTA 1: Obtener todas las líneas de producción (Método GET)
app.get('/api/lineas', async (req, res) => {
    try {
        // Ejecutamos la consulta SQL a la base de datos esperando una respuesta
        const resultado = await pool.query('SELECT * FROM lineas_produccion ORDER BY id ASC');
        
        // Respondemos al cliente enviando los registros encontrados en formato JSON
        res.json({
            success: true,
            total: resultado.rowCount,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Error al consultar líneas:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// 6. RUTA 2: Registrar un nuevo lote de producción (Método POST)
app.post('/api/lotes', async (req, res) => {
    // Extraemos los datos que vienen desde el cliente en el cuerpo de la petición (req.body)
    const { codigo_lote, formula, cantidad_litros, linea_id } = req.body;

    // Validación rápida: verificamos que los datos obligatorios no vengan vacíos
    if (!codigo_lote || !formula || !cantidad_litros || !linea_id) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos obligatorios: codigo_lote, formula, cantidad_litros y linea_id son requeridos.'
        });
    }

    try {
        // Preparamos la consulta SQL segura usando $1, $2... para evitar ataques de inyección SQL
        const querySQL = `
            INSERT INTO lotes (codigo_lote, formula, cantidad_litros, linea_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        
        const valores = [codigo_lote, formula, cantidad_litros, linea_id];

        // Ejecutamos la inserción en la base de datos
        const resultado = await pool.query(querySQL, valores);

        // Respondemos al cliente con un código 201 (Creado exitosamente) y el registro guardado
        res.status(201).json({
            success: true,
            message: 'Lote registrado exitosamente en el sistema de producción',
            data: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al registrar el lote:', error);
        
        // Si el código de lote ya existe, PostgreSQL lanza un error específico (código 23505)
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'El código de lote ya se encuentra registrado en el sistema.'
            });
        }

        res.status(500).json({ success: false, message: 'Error interno del servidor al guardar el lote' });
    }
});
app.get('/api/lotes', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM lotes ORDER BY id DESC');
        res.json({
            success: true,
            data: resultado.rows
        });
    } catch (error) {
        console.error('Error al consultar lotes:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta PUT para actualizar el estado de calidad de un lote específico
app.put('/api/lotes/:id/calidad', async (req, res) => {
    const { id } = req.params;
    const { estado_calidad } = req.body;

    // 1. Validación estricta: solo permitimos valores válidos de negocio
    const estadosPermitidos = ['APROBADO', 'RECHAZADO', 'PENDIENTE'];
    if (!estado_calidad || !estadosPermitidos.includes(estado_calidad)) {
        return res.status(400).json({
            success: false,
            message: 'Estado de calidad inválido. Use APROBADO, RECHAZADO o PENDIENTE.'
        });
    }

    try {
        // 2. Actualización parametrizada en PostgreSQL (evita inyección SQL)
        const query = `
            UPDATE lotes
            SET estado_calidad = $1
            WHERE id = $2
            RETURNING *;
        `;
        const resultado = await pool.query(query, [estado_calidad, id]);

        // 3. Verificamos si existía un lote con ese ID
        if (resultado.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `No se encontró ningún lote con ID ${id}.`
            });
        }

        res.json({
            success: true,
            message: `Lote ${resultado.rows[0].codigo_lote} marcado como ${estado_calidad}.`,
            data: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar calidad del lote:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno al actualizar el estado de calidad.'
        });
    }
});

// 7. Encendemos el servidor en el puerto configurado (por defecto 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en el puerto ${PORT}`);
});
