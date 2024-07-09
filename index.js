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
        throw err;
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
        if (err) throw err;
        res.send('Banco de dados criado...');
    });
});

app.get('/createtables', (req, res) => {
    let sql = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT,
            name VARCHAR(255),
            price DECIMAL(10, 2),
            size VARCHAR(10),
            color VARCHAR(50),
            image VARCHAR(255),
            PRIMARY KEY (id)
        );
    `;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send('Tabela de produtos criada...');
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
        if (err) throw err;
        res.send('Tabela de carrinho criada...');
    });
});

app.get('/insertdata', (req, res) => {
    let products = [
        { name: 'CHEETAH GLAM HOODIE', price: 79.99, size: 'M', color: 'Black', image: 'img/img-1.webp' },
        { name: 'Produto 2', price: 50.00, size: 'L', color: 'Red', image: 'img/img-2.webp' },
        { name: 'Produto 3', price: 60.00, size: 'S', color: 'Blue', image: 'img/img-3.webp' }
    ];

    products.forEach(product => {
        let checkSql = 'SELECT * FROM products WHERE name = ? AND size = ? AND color = ?';
        db.query(checkSql, [product.name, product.size, product.color], (err, results) => {
            if (err) throw err;
            if (results.length === 0) {
                let insertSql = 'INSERT INTO products (name, price, size, color, image) VALUES (?, ?, ?, ?, ?)';
                db.query(insertSql, [product.name, product.price, product.size, product.color, product.image], (err, result) => {
                    if (err) throw err;
                    console.log(`Produto ${product.name} inserido.`);
                });
            } else {
                console.log(`Produto ${product.name} já existe.`);
            }
        });
    });

    res.send('Verificação e inserção de dados concluídas...');
});

// Rota para obter os produtos
app.get('/api/products', (req, res) => {
    let sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para adicionar ao carrinho
app.post('/api/cart', (req, res) => {
    let { product_id, quantity } = req.body;
    let sql = 'INSERT INTO cart (product_id, quantity) VALUES (?, ?)';
    db.query(sql, [product_id, quantity], (err, result) => {
        if (err) throw err;
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
        if (err) throw err;
        res.json(results);
    });
});

// Rota para remover item do carrinho
app.delete('/api/cart/:id', (req, res) => {
    let { id } = req.params;
    let sql = 'DELETE FROM cart WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Produto removido do carrinho' });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
