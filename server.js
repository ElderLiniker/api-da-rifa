const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const admin = { password: '1234' }; // Senha do admin (use uma solução segura no futuro)

const numbers = {};

// Endpoint para login do admin
app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === admin.password) {
        return res.json({ success: true, message: 'Login realizado com sucesso!' });
    }
    return res.status(401).json({ success: false, message: 'Senha inválida.' });
});

// Endpoint para obter números reservados
app.get('/numbers', (req, res) => {
    res.json(numbers);
});

// Endpoint para reservar números
app.post('/numbers/reserve', (req, res) => {
    const { name, selectedNumbers } = req.body;

    // Verifica se números já estão reservados
    const alreadyReserved = selectedNumbers.filter(num => numbers[num]);
    if (alreadyReserved.length > 0) {
        return res.status(400).json({ success: false, message: `Números já reservados: ${alreadyReserved.join(', ')}` });
    }

    // Reserva os números
    selectedNumbers.forEach(num => {
        numbers[num] = { name, paid: false };
    });

    res.json({ success: true, message: 'Números reservados com sucesso!' });
});

// Endpoint para marcar números como pagos
app.post('/numbers/mark-paid', (req, res) => {
    const { number } = req.body;
    if (numbers[number]) {
        numbers[number].paid = true;
        return res.json({ success: true, message: 'Número marcado como pago.' });
    }
    return res.status(400).json({ success: false, message: 'Número não encontrado.' });
});

// Endpoint para excluir números
app.delete('/numbers/:number', (req, res) => {
    const number = req.params.number;
    if (numbers[number]) {
        delete numbers[number];
        return res.json({ success: true, message: 'Número excluído com sucesso.' });
    }
    return res.status(400).json({ success: false, message: 'Número não encontrado.' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
