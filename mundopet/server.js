const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3006;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "login_db",
});

// Conecta ao banco e trata erro
db.connect(err => {
    if (err) {
        console.error("Erro ao conectar no banco de dados:", err.message);
        process.exit(1);
    }
    console.log("Conectado ao banco de dados MySQL.");
});

// Rota para criar um novo cadastro de pet
app.post("/cadastro-pet", (req, res) => {
    console.log("Requisição recebida:", req.body);

    const { name, email, "pet-name": petName, "pet-age": petAge, "pet-species": petSpecies, message } = req.body;

    if (!name || !email || !petName || !petAge || !petSpecies) {
        return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    const sql = `
        INSERT INTO cadastro_pet (nome, email, nome_pet, idade_pet, especie_pet, mensagem)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, petName, petAge, petSpecies, message || null], (err, result) => {
        if (err) {
            console.error("Erro ao registrar pet:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Cadastro do pet realizado com sucesso!" });
    });
});

// Rota para obter todos os cadastros de pets
app.get("/cadastro-pet", (req, res) => {
    const sql = "SELECT * FROM cadastro_pet ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar cadastros:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});