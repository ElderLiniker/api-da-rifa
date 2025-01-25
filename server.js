require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Senha do administrador, protegida no backend
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Armazena os números reservados (substitua isso por um banco de dados em produção)
const reservedNumbers = {};

// Rota para autenticação do administrador
app.post('/admin/login', (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        res.status(200).send({ success: true, message: 'Autenticação bem-sucedida!' });
    } else {
        res.status(401).send({ success: false, message: 'Senha incorreta!' });
    }
});

// Rota para recuperar números reservados
app.get('/numbers', (req, res) => {
    const numbers = Object.entries(reservedNumbers).map(([number, details]) => ({
        number,
        ...details,
    }));
    res.status(200).json(numbers);
});

// Rota para reservar números
app.post('/reserve', (req, res) => {
    const { name, numbers } = req.body;

    const alreadyReserved = numbers.filter(number => reservedNumbers[number]);
    if (alreadyReserved.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Os números ${alreadyReserved.join(', ')} já estão reservados.`,
        });
    }

    numbers.forEach(number => {
        reservedNumbers[number] = { name, paid: false };
    });

    res.status(200).json({ success: true, message: 'Números reservados com sucesso!' });
});

// Inicializar o servidor
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
