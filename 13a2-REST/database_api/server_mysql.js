const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); //Cross Origin Resource Sharing (blokkolás az eltérő URL-ről érkező kérések estén)
const app = express();
const PORT = 3000;

//Middleware
app.use(express.json());
app.use(cors()); 

//MySQL kapcsolat
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'premo',
    database: 'usersdb'
});

//Kapcsolat ellenőrzése
db.connect((err) => {
    if (err) {
        console.error('MySQL kapcsolati hiba:', err);
    } else {
        console.log('Sikeres MySQL adatbázis kapcsolat.');
    }
});


//POST végpont az adatok eltárolására a users táblában
app.post('/api/users', (req, res) => {
    const { firstName, lastName, city, address, phone, email, gender } = req.body;
    
    const sql = `INSERT INTO users (firstName, lastName, city, address, phone, email, gender) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [firstName, lastName, city, address, phone, email, gender],
        //Callback függvény az esetleges adatbázis kapcsolódási hiba kezelésére, vagy a sikeres adatbázis művelet eredményének a visszaküldésére a kliensnek.
        function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Hiba történt az adatok rögzítése során!' })
            } else {
                return res.status(201).send({ message: 'Az adatok rögzítése sikeresvolt.', id: this.lastID, firstName, lastName, city, address, phone, email, gender });
            }
        }
    )
})

//GET végpont az adatbázis lekérésére
app.get('/api/users', (req, res) => {
    db.query(`SELECT * FROM users`, [], (err, records) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Hiba történt az adatok kiolvasása során!' });
        } else {
            //Hibakereséshez az adatok kilogolása a konzolra
            //console.log('Az adatbázisunk sorai:', records);
            return res.status(200).json(records);

        }
    })

})

//DELETE végpont az adatbázis egy sorának (id szerinti) törlésére
app.delete('/api/users/:id', (req, res) => {
    //Az id elérése az URL paraméteréből
    const { id } = req.params;

    //Az adatbázis sorának a törlése
    db.query(`DELETE FROM users WHERE id = ?`, [id],
        //Callback függvény a hiba kezelsére vagy a sikeres művelet nyugtázására.
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            } else {
               return res.status(200).json({ message: 'Sikeres adattörlés!' });
            }
        }
    )
})

//PUT végpont a táblázat adatainak a módosítására
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params; //id elérése az URL paramétert listájából
    const { firstName, lastName, city, address, phone, email, gender } = req.body; //Az adatok kinyerése a kliens üzenet törzséből
    //console.log(firstName);
    //console.log(lastName);
    //console.log(city);
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, city = ?, address = ?, phone = ?, email = ?, gender = ? WHERE id = ?';
    db.query(sql, [firstName, lastName, city, address, phone, email, gender, id],
        function (err) {
            if (err) {
              return res.status(500).send(err.message);
            } else {
                res.status(200).send({ message: 'A felhasználó frissítése megtörtént!', id, firstName, lastName, city, address, phone, email, gender });
            }
        }
    )
})



// A webszerver elindítása
app.listen(PORT, () => {
    console.log(`A webszerver fut a http://localhost:${PORT} webcímen.`)
})
