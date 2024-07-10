const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurações do MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mon_pere'
});

// Conecta ao MySQL
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rotas para páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/listaprodutos', (req, res) => {
    res.sendFile(path.join(__dirname, 'listaprodutos.html'));
});

app.get('/detalhesproduto', (req, res) => {
    res.sendFile(path.join(__dirname, 'detalhesproduto.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'contacto.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'checkout.html'));
});

// Cria as tabelas e insere dados
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE IF NOT EXISTS mon_pere';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erro ao criar banco de dados:', err);
            res.send('Erro ao criar banco de dados');
            return;
        }
        res.send('Banco de dados criado...');
    });
});

app.get('/createtables', (req, res) => {
    let sql = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT,
            name VARCHAR(255),
            price DECIMAL(10, 2),
            image VARCHAR(255),
            PRIMARY KEY (id)
        );
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela de produtos:', err);
            res.send('Erro ao criar tabela de produtos');
            return;
        }
        console.log('Tabela de produtos criada...');
    });

    let cartSql = `
        CREATE TABLE IF NOT EXISTS cart (
            id INT AUTO_INCREMENT,
            product_id INT,
            quantity INT,
            PRIMARY KEY (id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `;
    db.query(cartSql, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela de carrinho:', err);
            res.send('Erro ao criar tabela de carrinho');
            return;
        }
        res.send('Tabela de produtos e de carrinho criadas...');
    });
});

app.get('/', (req, res) => {
    let products = [
        { name: 'CHEETAH GLAM HOODIE', price: 79.99, image: 'img/img-1.webp' },
        { name: 'Produto 2', price: 50.00, image: 'img/img-2.webp' },
        { name: 'Produto 3', price: 60.00, image: 'img/img-3.webp' }
    ];

    let checkIfEmptySql = 'SELECT COUNT(*) AS count FROM products';
    db.query(checkIfEmptySql, (err, results) => {
        if (err) {
            console.error('Erro ao verificar tabela de produtos:', err);
            res.send('Erro ao verificar tabela de produtos');
            return;
        }
        if (results[0].count === 0) {
            let insertSql = `
                INSERT INTO products (name, price, image) VALUES
                ('CHEETAH GLAM HOODIE', 79.99, 'img/img-1.webp'),
                ('Produto 2', 50.00, 'img/img-2.webp'),
                ('Produto 3', 60.00, 'img/img-3.webp')
            `;
            db.query(insertSql, (err, result) => {
                if (err) {
                    console.error('Erro ao inserir produtos:', err);
                    res.send('Erro ao inserir produtos');
                    return;
                }
                console.log('Produtos inseridos.');
                res.send('Produtos inseridos.');
            });
        } else {
            console.log('Os produtos já existem, não foram inseridos.');
            res.send('Os produtos já existem, não foram inseridos.');
        }
    });
});

// Rota para obter os produtos
app.get('/api/products', (req, res) => {
    let sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao obter produtos:', err);
            res.send('Erro ao obter produtos');
            return;
        }
        res.json(results);
    });
});

// Rota para adicionar ao carrinho
app.post('/api/cart', (req, res) => {
    let { product_id, quantity } = req.body;
    let sql = 'INSERT INTO cart (product_id, quantity) VALUES (?, ?)';
    db.query(sql, [product_id, quantity], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar ao carrinho:', err);
            res.send('Erro ao adicionar ao carrinho');
            return;
        }
        res.json({ message: 'Produto adicionado ao carrinho' });
    });
});

// Rota para obter os itens do carrinho
app.get('/api/cart', (req, res) => {
    let sql = `
        SELECT cart.id, products.name, products.price, cart.quantity, products.image
        FROM cart
        JOIN products ON cart.product_id = products.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao obter itens do carrinho:', err);
            res.send('Erro ao obter itens do carrinho');
            return;
        }
        res.json(results);
    });
});

// Rota para remover item do carrinho
app.delete('/api/cart/:id', (req, res) => {
    let { id } = req.params;
    let sql = 'DELETE FROM cart WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover item do carrinho:', err);
            res.send('Erro ao remover item do carrinho');
            return;
        }
        res.json({ message: 'Produto removido do carrinho' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
