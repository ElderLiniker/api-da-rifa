require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: '*', // Permite acesso de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Importa o objeto db com todos os modelos carregados
const db = require('./models'); // Certifique-se de que o caminho está correto

// Usa a senha do .env
const admin = { password: process.env.ADMIN_PASSWORD }; 

// Endpoint para login do admin
app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === admin.password) {
        return res.json({ success: true, message: 'Login realizado com sucesso!' });
    }
    return res.status(401).json({ success: false, message: 'Senha inválida.' });
});

// Reservar números
app.post('/numbers/reserve', async (req, res) => {
    const { name, selectedNumbers } = req.body;

    try {
        if (!name || !selectedNumbers || !Array.isArray(selectedNumbers)) {
            return res.status(400).json({ success: false, message: 'Nome e números são obrigatórios' });
        }

        // Verificar se os números já estão reservados
        const existingNumbers = await db.Number.findAll({
            where: { number: selectedNumbers }
        });

        if (existingNumbers.length > 0) {
            const reserved = existingNumbers.map(n => n.number);
            return res.status(400).json({ success: false, message: `Números já reservados: ${reserved.join(', ')}` });
        }

        // Criar novas reservas
        const newNumbers = selectedNumbers.map(num => ({ number: num, name }));
        await db.Number.bulkCreate(newNumbers);

        res.json({ success: true, message: 'Números reservados com sucesso!' });
    } catch (err) {
        console.error("Erro ao reservar números:", err);
        res.status(500).json({ success: false, message: 'Erro no servidor', error: err });
    }
});

// Buscar todos os números reservados
app.get('/numbers', async (req, res) => {
    const numbers = await db.Number.findAll();
    res.json(numbers);
});

// Endpoint para marcar números como pagos
app.post('/numbers/mark-paid', async (req, res) => {
    const { number } = req.body;

    try {
        const num = await db.Number.findOne({ where: { number } });
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
        const deleted = await db.Number.destroy({ where: { number } });
        if (!deleted) {
            return res.status(400).json({ success: false, message: 'Número não encontrado.' });
        }

        res.json({ success: true, message: 'Número excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro no servidor', error: err });
    }
});

// Endpoint para comprar rifa
app.post("/comprar-rifa", async (req, res) => {
    try {
        const { nome, numeros } = req.body;

        // Verifica se algum número já está reservado
        const existing = await db.Rifa.findAll({ where: { numero: numeros } });
        if (existing.length > 0) {
            const reservados = existing.map(r => r.numero);
            return res.status(400).json({ error: `Os números ${reservados.join(", ")} já foram reservados.` });
        }

        // Salvar cada número no banco
        const rifas = await Promise.all(numeros.map(numero =>
            db.Rifa.create({ nome, numero })
        ));

        res.status(201).json(rifas);
    } catch (error) {
        console.error("Erro ao salvar:", error);
        res.status(500).json({ error: "Erro ao salvar a rifa" });
    }
});

// Conexão com o banco de dados
const sequelize = require('./config/database'); 

// Sincroniza o banco de dados
sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado'))
    .catch(err => console.error('Erro ao sincronizar:', err));

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
