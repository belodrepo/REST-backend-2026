//REST API kliens .then .catch láncolással

function calculate(operator) {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);

    if(isNaN(num1) || isNaN(num2)) {
        document.getElementById('result').textContent = "Kérem adjon meg egy számot!";
        return;
    }
    fetch('http://localhost:3000/api/calculate',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num1, num2, operator })
    })

    .then(response => {
        //debugger;
        if (!response.ok) {
            throw new Error('Hiba történt a kérés feldolgozása során!');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('result').textContent = data.result;
    })
    .catch(error => {
        document.getElementById('result').textContent = `Hiba: ${error.message}`;
    });
    
}