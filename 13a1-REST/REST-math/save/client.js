//Kliens oldali szkript az adatok küldésére és fogadására a REST API számára
//async/await módszer

async function calculate(operator) {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);

//Input mezők validálása
if(isNaN(num1) || isNaN(num2)) {
    document.getElementById('result').textContent = "Kérem adjon meg egy számot!";
}

//Az adatok elküldése a klienstől az API-nak.
const response = await fetch('http://localhost:3000/api/math', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ num1, num2, operator })
})

//Az eredmény fogadása az API-tól
const data = await response.json();
document.getElementById('result').textContent = data.result;

}
