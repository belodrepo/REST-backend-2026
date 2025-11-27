const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL adatbázis kapcsolat Sequelize ORM-el
const sequelize = new Sequelize('ormdb', 'root', 'premo', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// =======================
//  MODELS
// =======================

// User modell
const User = sequelize.define('User', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    tableName: 'users'
});

// Product modell
const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false }
}, {
    timestamps: false,
    tableName: 'products'
});

// Order modell
const Order = sequelize.define('Order', {
    status: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    tableName: 'orders'
});

// =======================
//  KAPCSOLATOK
// =======================

// 1 user → több order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// order ↔ product (N:M)
Order.belongsToMany(Product, { through: 'OrderProducts' });
Product.belongsToMany(Order, { through: 'OrderProducts' });

// =======================
//  SYNC DATABASE
// =======================

sequelize.sync()
    .then(() => console.log('Adatbázis kapcsolat rendben, táblák szinkronizálva.'))
    .catch(err => console.error('Hiba az adatbázis kapcsolat során:', err));


// =======================
//  USER CRUD
// =======================

// CREATE user
app.post('/api/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: 'A felhasználó rögzítése sikeres.', user });
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a felhasználó rögzítése során!', err });
    }
});

// READ all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt az adatok lekérése során!', err });
    }
});

// UPDATE user
app.put('/api/users/:id', async (req, res) => {
    try {
        const updated = await User.update(req.body, { where: { id: req.params.id } });

        if (!updated[0]) return res.status(404).json({ message: 'A felhasználó nem található!' });

        res.status(200).json({ message: 'A felhasználó frissítése sikeres.' });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a frissítés során!', err });
    }
});

// DELETE user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id } });

        if (!deleted) return res.status(404).json({ message: 'A felhasználó nem található!' });

        res.status(200).json({ message: 'Sikeres adattörlés.' });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a törlés során!', err });
    }
});


// =======================
//  PRODUCT CRUD
// =======================

// CREATE product
app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: 'Termék sikeresen létrehozva.', product });
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a termék létrehozásakor!', err });
    }
});

// READ all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a termékek lekérése során!', err });
    }
});

// READ one product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) return res.status(404).json({ message: 'A termék nem található!' });

        res.status(200).json(product);

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a termék lekérése során!', err });
    }
});

// UPDATE product
app.put('/api/products/:id', async (req, res) => {
    try {
        const updated = await Product.update(req.body, { where: { id: req.params.id } });

        if (!updated[0]) return res.status(404).json({ message: 'A termék nem található!' });

        res.status(200).json({ message: 'Termék frissítve.' });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a frissítés során!', err });
    }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deleted = await Product.destroy({ where: { id: req.params.id } });

        if (!deleted) return res.status(404).json({ message: 'A termék nem található!' });

        res.status(200).json({ message: 'Termék törölve.' });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a törlés során!', err });
    }
});


// =======================
//  ORDER CRUD
// =======================

// CREATE order (termékekkel)
app.post('/api/orders', async (req, res) => {
    try {
        const { userId, status, productIds } = req.body;

        const order = await Order.create({ userId, status });

        if (productIds?.length > 0) {
            const products = await Product.findAll({ where: { id: productIds } });
            await order.addProducts(products);
        }

        res.status(201).json({ message: 'Rendelés létrehozva.', order });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a rendelés létrehozásakor!', err });
    }
});

// READ all orders (products-szel)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({ include: Product });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a rendelések lekérése során!', err });
    }
});

// READ one order
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id },
            include: Product
        });

        if (!order) return res.status(404).json({ message: 'A rendelés nem található!' });

        res.status(200).json(order);

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a rendelés lekérése során!', err });
    }
});

// UPDATE order
app.put('/api/orders/:id', async (req, res) => {
    try {
        const updated = await Order.update(req.body, { where: { id: req.params.id } });

        if (!updated[0]) return res.status(404).json({ message: 'A rendelés nem található!' });

        res.status(200).json({ message: 'Rendelés frissítve.' });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a frissítés során!', err });
    }
});

// UPDATE order products (replace)
app.put('/api/orders/:id/products', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Rendelés nem található!' });

        const { productIds } = req.body;

        const products = await Product.findAll({ where: { id: productIds } });

        await order.setProducts(products); // teljes csere

        res.status(200).json({ message: 'Termékek frissítve a rendelésben.' });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a termékek frissítése során!', err });
    }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const deleted = await Order.destroy({ where: { id: req.params.id } });

        if (!deleted) return res.status(404).json({ message: 'A rendelés nem található!' });

        res.status(200).json({ message: 'Rendelés törölve.' });

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a törlés során!', err });
    }
});


// =======================
//  SPECIAL: user → orders → products
// =======================

app.get('/api/users/:id/orders/products', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            include: {
                model: Order,
                include: Product
            }
        });

        if (!user) return res.status(404).json({ message: 'Felhasználó nem található.' });

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a lekérdezés során!', err });
    }
});


// =======================
//  SERVER START
// =======================

app.listen(PORT, () => {
    console.log(`A szerver fut a http://localhost:${PORT} címen.`);
});

