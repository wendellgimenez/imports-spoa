const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();
const PORT = 5000;

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/imports_spoa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware para permitir requisições do frontend
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo ao backend da Imports Spoa!');
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar se o usuário existe
    console.log('Procurando usuário:', username); // Log para depuração
    const user = await User.findOne({ username });
    console.log('Usuário encontrado:', user); // Log para depuração
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar a senha
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user._id }, 'secret-key', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Erro no servidor:', err); // Log para depuração
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota protegida (exemplo)
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    res.json({ message: 'Rota protegida acessada com sucesso', user: decoded });
  });
});

// Rota para listar todos os produtos
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para criar um novo produto
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para atualizar um produto
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Rota para deletar um produto
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

