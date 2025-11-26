//REST API Klines oldali szkript az adatok küldésére és fogadására a REST Backend számára
/* 
REST API kliens megvalósítása Async/Await módszerrel (aszinkron függvényhívás).
Az aszinkron művelet visszatérési értéke egy Promise objektum.
A Promise objektum állapotai:
1. pending: várakozás az API-al való kapcsolatra
2. fullfilled: kapcsolat létrejött
3. rejected: kapcsolat visszautasítva
*/

async function calculate(operation) {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);

    if(isNaN(num1) || isNaN(num2)) {
        document.getElementById('result').textContent = "Kérem adjon meg egy számot!";
        return;
    }

    //Az adatok küldése a klienstől az API-nak
const response = await fetch('http://localhost:3000/api/math',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ num1, num2, operation })
});

//Az adatok fogadás az API-tól
const data = await response.json();
document.getElementById('result').textContent = data.result;
}