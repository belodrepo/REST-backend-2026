const express = require('express');
const app = express();
const port = 3000;

//Midlleware - köztes alkalmazások
app.use(express.json()); //JSON kezelés

app.get('/api.date', (req, res) => {
    const today = new Date();
    const day = today.toLocaleDateString();
    if (!day) res.send('Valami hiba történt!');
    res.send(`A mai dátum: ${day}, ${time}`);
})

app.get('/api.temp', (req, res) => {
    async function udvozlet() {
        let valasz = await fetch("https://api.open-meteo.com/v1/forecast?latitude=46.7654&longitude=17.2479&current_weather=true");
        let adat = await valasz.json();
        if (!adat) res.send('Valami hiba történt!');
        res.send(`A mai hőmérséklet: ${adat.current_weather.temperature} °C`);
    }
    udvozlet();
})

const answers = [
    "Köszönöm jól.",
    "Ma nincs jó kedvem.",
    "Kissé másnaposan.",
    "Ne is kérdezd.",
    "Remekül...",
    "Lehetnék jobban is.",
    "Már vártam a kérdést.",
    "Minden OK.",
    "És vezed mizu...?"
];

app.get('/api.greetings', (req, res) => {
    const randomIndex = Math.floor(Math.random() * answers.length);
    const randomAnswer = answers[randomIndex];
    res.send(randomAnswer);
})


app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} webcímen.`); //Kiírja hogy fut a szerver

});