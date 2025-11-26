const express = require('express');
const app = express();
//CORS - Cross Origin Resource Sharing
const cors = require('cors'); //CORS modul importálása


app.use(express.json()); //Middleware a JSON kezelésére
app.use(cors()); //CORS middleware bekapcsolása

app.post('/api/calculate', (req, res) => {
    const { num1, num2, operator } = req.body; //A klienstől érkező adatok elérése
    
//Validáció - Ellenőrizzük, hogy mind a két szám létezik és szám típus-e.
if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return res.status(400).json({error: 'Hiányzó, vagy érvénytelen számok!'});
}
    //Számolási logika
    let result;
    if(operator == "add") {
        result = num1 + num2;
    }
    else if (operator == "subtract") {
        result = num1 - num2;
    }
    else {
        return res.status(400).json({message: 'Érvénytelen művelet!'})
    }
    res.status(200).json({message: 'A kiszámolt eredmény:', result});
})

const port = 3000;
app.listen(port, () => {
console.log(`A webszerver fut a http://localhost:${port} webcímen`);
})