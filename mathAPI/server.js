const express = require('express');
const app = express();
const port = 3000;

//Midlleware - köztes alkalmazások
app.use(express.json()); //JSON kezelés

app.post('/api.mathapi', (req, res) => {
    const { num1, num2, operator } = req.body;
    const op = operator.toLowerCase();
    let result;
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
        return res.status(400).json({ hiba: 'A bemeneti értékeknek számoknak kell lenniük!' });
    }
    if (op == "+") {
        result = num1 + num2;
    }
    else if (op == "-") {
        result = num1 - num2;
    }
    else {
        return res.status(400).json({ error: 'Érvénytelen művelet!' }); //Státusz kód és hibaüzenet visszadaása
    }
    res.status(200).json({message: "Számított eredmény", result});
})

app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} webcímen.`); //Kiírja hogy fut a szerver

});