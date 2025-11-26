const express = require('express');
const cors = require('cors'); 
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3000;

//Middleware - köztes alkalamzások
app.use(express.json());
app.use(cors()); //Cross Origin Resource Sharing

//MySQL adatbázis kapcsolat a Sequelize ORM-el
const sequelize = new Sequelize('ormdb1', 'root', 'premo', {
    host: localhost,
    dialect: mysql,
    logging: false
});

//User modell definiálása
const User = Sequelize.define('User', {
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
//Adatbázis kapcsolat ellenőrzése
.then(() => console.log('Adatbázis kapcsolat létrejött és a táblák szinkronizálva'))
.catch(err => console.error('Hiba történt az adatbázis kapcsolat során!', err));


//POST - új felhasználó létrehozása
app.post('/api/users', async (req, res) => {
    try{
        const user = await User.create(req.body);
        res.status(201).json({ message: 'A felhasználó rögzítése sikeres volt', user });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Hiba történt a felhasználó rögzítése során!' })
    }
})

//GET - Összes felhasználó lekérése
app.get('/api/users', async (req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Hiba történt az adatok lekérése során!' })
    }
})

//DELETE - felhasználó törlése
app.delete('/api/users/:id', async (req, res) => {
    try{
        const deleted = await User.destroy({
            where: { id: req.params.id }
        })

        if (deleted) {
            res.status(200).json({ message: 'Sikeres dattörlés.' });
        }
        else {
            res.status(404).json({ message: 'A felhasználó nem található!'});
        }
        
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Hiba történt a felhasználó törlése során!' })
    }
})