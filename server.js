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
const Number = require('./models/number');

// Reservar números
app.post('/numbers/reserve', async (req, res) => {
    const { name, selectedNumbers } = req.body;

    try {
        // Verificar se já estão reservados
        const existingNumbers = await Number.findAll({ where: { number: selectedNumbers } });
        if (existingNumbers.length > 0) {
            const reserved = existingNumbers.map(n => n.number);
            return res.status(400).json({ success: false, message: `Números já reservados: ${reserved.join(', ')}` });
        }

        // Criar novas reservas
        await Number.bulkCreate(selectedNumbers.map(num => ({ number: num, name })));

        res.json({ success: true, message: 'Números reservados com sucesso!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro no servidor', error: err });
    }
});

// Buscar todos os números reservados
app.get('/numbers', async (req, res) => {
    const numbers = await Number.findAll();
    res.json(numbers);
});


// Endpoint para marcar números como pagos
app.post('/numbers/mark-paid', async (req, res) => {
    const { number } = req.body;

    try {
        const num = await Number.findOne({ where: { number } });
        if (!num) {
            return res.status(400).json({ success: false, message: 'Número não encontrado.' });
        }

        num.paid = true;
        await num.save();

        res.json({ success: true, message: 'Número marcado como pago.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro no servidor', error: err });
    }
});


// Endpoint para excluir números
app.delete('/numbers/:number', async (req, res) => {
    const { number } = req.params;

    try {
        const deleted = await Number.destroy({ where: { number } });
        if (!deleted) {
            return res.status(400).json({ success: false, message: 'Número não encontrado.' });
        }

        res.json({ success: true, message: 'Número excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro no servidor', error: err });
    }
});

const sequelize = require('./config/database'); // Importa a conexão com o banco

// Sincroniza o banco de dados
sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado'))
    .catch(err => console.error('Erro ao sincronizar:', err));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
