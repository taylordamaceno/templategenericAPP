const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./database');
const modulesRoutes = require('./routes/modules');
const userProgressRoutes = require('./routes/userProgress');
const { getDicas } = require('./models/dicas'); // Importa o modelo de dicas

const app = express();
const PORT = 3001;
const SECRET_KEY = "90b7f602d68080c1571d9370b8b8683210595d2bc05677fabedaa61c78fa2a7d";

// Configuração do CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/modules', modulesRoutes);
app.use('/api/userProgress', userProgressRoutes);

// Adiciona a rota direta para /api/dicas
app.get('/api/dicas', async (req, res) => {
    try {
        const dicas = await getDicas(); // Busca as dicas do banco de dados
        res.json(dicas); // Retorna as dicas como JSON
    } catch (error) {
        console.error('Erro ao buscar dicas:', error);
        res.status(500).send({ error: error.message });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).send({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = (await db.query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
        if (!user) return res.status(404).send({ error: 'User not found' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).send({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.send({ message: 'Logged in successfully!', token });
    } catch (error) {
        console.error("Erro ao logar usuário:", error);
        res.status(500).send({ error: error.message });
    }
});

// Exemplo de rota protegida
app.get('/dashboard', authenticateToken, (req, res) => {
    res.send({ message: 'Bem-vindo ao dashboard!' });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});