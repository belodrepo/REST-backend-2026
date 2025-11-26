const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3000;

//Middleware
app.use(express.json());
app.use(cors()); 

//MySQL adatbázis kapcsolat Sequelize ORM-el
const sequelize = new Sequelize('ormdb', 'root', 'premo', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

//User modell definiálása
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

//Adatbázis szinkronizálása (tábla létrehozása)
sequelize.sync()
.then(() => console.log('Adatbázis kapcsolata létrejött és a táblák szinkronizálva'))
.catch(err => console.error('Hiba az adatbázis kapcsolata során', err));

//POST - új felhasználó létrehozása
app.post('/api/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: 'A felhasználó rögzítése sikeres volt.', user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Hiba történt a felhasználó rögzítése során!' });
    }
})

//GET - összes felhasználó lekérése
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Hiba történt az adatok lekérése során!' });
    }
})

//DELETE - felhasználó törlése
app.delete('/api/users/:id', async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Sikeres adattörlés.' });
        }
        else {
            res.status(404).json({ message: 'A felhasználó nem található!' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Hiba történt a törlés során!', err });
    }
})

//PUT - felhasználó frissítése
app.put('/api/users/:id', async (req, res) => {
    try {
        const updated = await User.update({
            where: { id: req.params.id }
        });

        if (updated[0] === 1) {
            res.status(200).json({ message: 'A felhasználó frisítése megrörtént..' });
        }
        else {
            res.status(404).json({ message: 'A felhasználó nem található!' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Hiba történt a frissítés során!', err });
    }
})

// A webszerver elindítása
app.listen(PORT, () => {
    console.log(`A webszerver fut a http://localhost:${PORT} webcímen.`)
})