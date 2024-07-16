const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');

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
    createDatabaseAndTables();
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de sessão
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

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
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'checkout.html'));
});

// Função para criar o banco de dados e tabelas, e inserir dados
function createDatabaseAndTables() {
    db.query('CREATE DATABASE IF NOT EXISTS mon_pere', (err, result) => {
        if (err) throw err;
        console.log('Banco de dados criado ou já existe.');

        db.query('USE mon_pere', (err, result) => {
            if (err) throw err;

            let createProductsTable = `
                CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT,
                name VARCHAR(255),
                price DECIMAL(10, 2),
                sale_price DECIMAL(10, 2),
                description TEXT,
                stars INT,
                image VARCHAR(255),
                thumbnail1 VARCHAR(255),
                thumbnail2 VARCHAR(255),
                thumbnail3 VARCHAR(255),
                PRIMARY KEY (id)
            );
            `;
            db.query(createProductsTable, (err, result) => {
                if (err) throw err;
                console.log('Tabela de produtos criada ou já existe.');

                let createCartTable = `
                    CREATE TABLE IF NOT EXISTS cart (
                        id INT AUTO_INCREMENT,
                        product_id INT,
                        size VARCHAR(10),
                        color VARCHAR(50),
                        quantity INT,
                        PRIMARY KEY (id),
                        FOREIGN KEY (product_id) REFERENCES products(id)
                    )
                `;
                db.query(createCartTable, (err, result) => {
                    if (err) throw err;
                    console.log('Tabela de carrinho criada ou já existe.');

                    let createUsersTable = `
                        CREATE TABLE IF NOT EXISTS users (
                            id INT AUTO_INCREMENT,
                            email VARCHAR(255) NOT NULL,
                            password VARCHAR(255) NOT NULL,
                            PRIMARY KEY (id),
                            UNIQUE KEY unique_email (email)
                        )
                    `;
                    db.query(createUsersTable, (err, result) => {
                        if (err) throw err;
                        console.log('Tabela de usuários criada ou já existe.');

                        let products = [
                            { id: 1, name: 'CHEETAH GLAM HOODIE', price: 79.99, sale_price: 99.99, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', stars: 4, image: 'img/img-1.webp', thumbnail1: 'img/img-1.webp', thumbnail2: 'img/img-1.webp', thumbnail3: 'img/img-1.webp' },
                            { id: 2, name: 'Sweater Bruh', price: 50.00, sale_price: 59.99, description: 'Incrivel', stars: 5, image: 'img/image.webp', thumbnail1: 'img/image.webp', thumbnail2: 'img/image.webp', thumbnail3: 'img/image.webp' },
                            { id: 3, name: 'Quadro', price: 60.00, sale_price: 89.99, description: 'Fodase Mesmo', stars: 3, image: 'img/foto.jpg', thumbnail1: 'img/foto.jpg', thumbnail2: 'img/foto.jpg', thumbnail3: 'img/foto.jpg' },
                        ];

                        products.forEach(product => {
                            let sql = 'SELECT * FROM products WHERE name = ? AND price = ? AND image = ?';
                            db.query(sql, [product.name, product.price, product.image], (err, result) => {
                                if (err) throw err;
                                if (result.length === 0) {
                                    let insertSql = 'INSERT INTO products (name, price, image, description, stars) VALUES (?, ?, ?, ?, ?)';
                                    db.query(insertSql, [product.name, product.price, product.image, product.description, product.stars], (err, result) => {
                                        if (err) throw err;
                                        console.log(`Produto ${product.name} inserido.`);
                                    });
                                } else {
                                    console.log(`Produto ${product.name} já existe.`);
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

// Rota para obter os produtos
app.get('/api/products', (req, res) => {
    let sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para obter detalhes de um produto
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    let sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [productId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Product not found');
        } else {
            res.json(result[0]);
        }
    });
});

// Rota para adicionar ao carrinho
app.post('/api/cart', (req, res) => {
    let { product_id, size, color, quantity } = req.body;
    let sql = 'INSERT INTO cart (product_id, size, color, quantity) VALUES (?, ?, ?, ?)';
    db.query(sql, [product_id, size, color, quantity], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Produto adicionado ao carrinho' });
    });
});

// Rota para obter os itens do carrinho
app.get('/api/cart', (req, res) => {
    let sql = `
        SELECT cart.id, products.name, products.price, cart.quantity, cart.size, cart.color, products.image
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

        // Resetar o auto incremento da tabela cart
        db.query('ALTER TABLE cart AUTO_INCREMENT = 1', (err, result) => {
            if (err) throw err;
            res.json({ message: 'Produto removido do carrinho e IDs resetados' });
        });
    });
});

// Rota para registro de usuário
app.post('/users/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    let sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Email already exists');
            }
            throw err;
        }
        res.send('User registered successfully');
    });
});

// Rota para login de usuário
app.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(400).send('User not found');
        }
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(400).send('Invalid password');
        }

        // Save user session
        req.session.user = { id: user.id, email: user.email };
        res.send('Login successful');
    });
});

// Rota para logout de usuário
app.get('/users/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});

// Rota para verificar status de login
app.get('/users/login-status', (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, email: req.session.user.email });
    } else {
        res.send({ loggedIn: false });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
