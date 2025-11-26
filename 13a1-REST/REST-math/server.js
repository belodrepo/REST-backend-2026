const express = require ('express');
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json()); //Middleware a JSON kezeléséhez
app.use(cors());

//POST végpont a klinstől érkező adatok fogadására és feldolgozására
app.post('/api/math', (req, res) => {
    //A klienstől érkező adatok elérése változókban
    const { num1, num2, operator } = req.body; //Object destruction

//Backend oldali validáció - Ellnőrizzük, hogy mind a két szám létezik és szám típus
if(typeof num1 != 'number' || typeof num2 !== 'number') {
    return res.status(400).json({error: 'Hiányzó, vagy érvénytelen számok!'});
}

    //Számolási logika
    let result;
    if(operator == "add") {
        result = num1 + num2;
    }
    else if(operator == "subtract") {
        result = num1 - num2;
    }
    else {
        return res.status(400).json({message: 'Érvénytelen művelet'});
    }
    res.status(200).json({message: 'A kiszámolt eremény:', result});
})

app.listen(port, () => {
    console.log(`A webszerver fut a http://localhost:${port} webcímen.`)
})