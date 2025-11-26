//REST Frontend - HTML kliens, az API elérésére és az adatbázis műveletekre


const apiUrl = 'http://localhost:3000/api/users'; //Az API elérési útvonala
const usersData = document.getElementById('usersData'); //Az output táblázat törzse

//Az API elérése és az adatok lekérése

//Az adatok lekérésére szolgáló függvény
async function getUsers() {
    try {
        const response = await fetch(apiUrl); //Kapcsolódás az API-hoz
        const users = await response.json(); //Az adatok lekérése az API-tól (a users egy tömb)
        
        //A user egy objektum
        usersData.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.city}</td>
                <td>${user.address}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.gender}</td>
                <td>
                <button onClick="editUser(${user.id}, '${user.firstName}', '${user.lastName}', '${user.city}', '${user.address}', '${user.phone}', '${user.email}', '${user.gender}')">Módosítás</button>
                <button onClick="deleteUser(${user.id})">Törlés</button>
                </td>
            </tr>
            `).join(''); 

    }
    catch(e) {
            console.error(e.message); //Hibaüzenet küldése a konzolra - fejlesztéshez
            alert('Hiba történt az adatok elérése során!');
    }
}

//Adatok küldése az API-nak
//Az űrlap adatok összegyűjtése
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault(); //Az alapértelmezett űrlap viselkedés letiltása

    try {
        const formData = new FormData(e.target); //Az űrlap adatainak az elérése
        const data = Object.fromEntries(formData); //A data objektum tárolja az input mezőket

        //Az input elemek kitöltöttségének az ellenőrzése
        if (!data.firstName || !data.lastName || !data.city || !data.address || !data.phone || !data.email || !data.gender) {
            alert('Hiányző adatok!, Kérem, hogy minden mezőt töltsön ki!')
        } else {
            const response = await fetch(apiUrl,  {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            //Várunk a szerver(API) válaszára
            const result = await response.json();

            //Az API válaszától függően...
            if (response.ok) {
                alert(result.message);
                getUsers(); //A táblázat frissítése
            } else {
                alert(result.message);
            }
            e.target.reset();
        }

    }
    catch (error) {
        alert(error.message);
    }
})

//Felhasználó módosítása
async function editUser(id, firstName, lastName, city, address, phone, email, gender) {
    //Az új adatok bekérése
    const newFirstName = prompt('Add meg az új vezetéknevet:', firstName);
    const newLastName = prompt('Add meg az új keresztnevet:', lastName);
    const newCity = prompt('Add meg az új települést:', city);
    const newAddress = prompt('Add meg az új címet:', address);
    const newPhone = prompt('Add meg az új telefonszámot:', phone);
    const newEmail = prompt('Add meg az új email címet:', email);
    const newGender = prompt('Add meg az új nemet:', gender);

    if (newFirstName && newLastName && newCity && newAddress && newPhone && newEmail && newGender) {
        try{
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: newFirstName, lastName: newLastName, city: newCity, address: newAddress, phone: newPhone, email: newEmail, gender: newGender })
            });
            if (response.ok) {
                getUsers();
            }
            else {
                console.error('Hiba történt a felhasználó adatainak amódosítása során!', await response.json());
            }
        }
        catch (error) {
                console.error('Nem sikerült a felhasználó adatainak a frissítése', error)
        }
    }
}

//Felhasználói adatok törlése
async function deleteUser(id) {
    if (confirm('Valóban törölni akarod a felhasználót?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });

            //Nézzük meg, hogy mit válaszolt az API
            if (response.ok) {
                getUsers(); //A táblázat frissítése
            }
            else {
                console.error('Hiba történt a felhasználó törlése során!', await response.json);
            }
        }
        catch (error) {
            alert('A felhasználó törlése sikertelen volt!');
            console.error('Az adatok törlése sikertelen volt!', error)
        }
    }
}

getUsers(); //Az adatok lekérésére szolgáló függvény meghívása