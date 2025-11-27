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
//  USER ENDPOINTS
// =======================

// Új user
app.post('/api/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: 'A felhasználó rögzítése sikeres.', user });
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a felhasználó rögzítése során!', err });
    }
});

// Összes user
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt az adatok lekérése során!', err });
    }
});

// User törlése
app.delete('/api/users/:id', async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Sikeres adattörlés.' });
        } else {
            res.status(404).json({ message: 'A felhasználó nem található!' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a törlés során!', err });
    }
});

// User frissítése
app.put('/api/users/:id', async (req, res) => {
    try {
        const updated = await User.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated[0] === 1) {
            res.status(200).json({ message: 'A felhasználó frissítése sikeres.' });
        } else {
            res.status(404).json({ message: 'A felhasználó nem található!' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a frissítés során!', err });
    }
});


// =======================
//  TERMÉK ENDPOINT
// =======================

app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: 'Termék sikeresen létrehozva.', product });
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a termék létrehozása során!', err });
    }
});

// =======================
//  ORDER ENDPOINT
// =======================

// Új rendelés felvitele termékekkel együtt
app.post('/api/orders', async (req, res) => {
    try {
        const { userId, status, productIds } = req.body;

        const order = await Order.create({ userId, status });

        // Termékek hozzárendelése
        if (productIds && productIds.length > 0) {
            const products = await Product.findAll({ where: { id: productIds } });
            await order.addProducts(products);
        }

        res.status(201).json({ message: 'Rendelés létrehozva.', order });
    } catch (err) {
        res.status(500).json({ message: 'Hiba történt a rendelés létrehozásakor!', err });
    }
});

// =======================
//  SPECIÁLIS LEKÉRDEZÉS
//  "Milyen termékeket rendelt a felhasználó?"
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

        if (!user) {
            return res.status(404).json({ message: 'Felhasználó nem található.' });
        }

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
