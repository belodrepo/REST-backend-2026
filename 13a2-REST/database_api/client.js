//REST frontend - HTML kliens, az API elérésére és az adatbázis műveletekre.

const apiUrl = 'http://localhost:3000/api/users';
const usersData = document.getElementById('usersData'); //A táblázat törzse

//Az API elérése és az adatok lekérése

//Függvény az adatok lekérésére
async function getUsers() {
    debugger;
    try {
        const response = await fetch(apiUrl); //Kapcsolódás az API-hoz.
        const users = await response.json(); //A felhasználói adatok tömbje (objektumokban tárolja az adatbázis rekordjait )

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
                <button onClick="editUser(${user.id}, '${user.firstName}', '${user.lastName}', '${user.city}', '${user.address}', '${user.phone}', '${user.email}', '${user.gender}',)">Módosítás</button>
                <button onClick="deleteUser(${user.id})">Törlés</button>
                </td>
            </tr>
            `).join('');
    }
    catch (e) {
        console.error(e.message);
        alert('Hiba történt az adatok elérése során!');
    }
}

//Adatok küldése az API-nak
//Az űrlap adatok összegyűjtése
document.getElementById('userForm').addEventListener('submit', async (e) => {
    //Az alapértelmezett űrlap viselkedés kikapcsolása
    e.preventDefault();
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        //Az input elemek kitöltöttségének az ellenőrzése
        if (!data.firstName || !data.lastName || !data.city || !data.address || !data.phone || !data.email || !data.gender) {
            alert('Hiányzó adatok!');
        } else {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            //Várunk a szerver(API) válaszára
            const result = await response.json();

            //Az API válaszától függően...
            if (response.ok) {
                alert(result.message); //Válaszüzenet megjelnítése
                getUsers(); //A HTML táblázat frissítése
            } else {
                alert(result.message); //Válaszüzenet megjelnítése
            }
            e.target.reset();

        }

    }
    catch (e) {
        alert(e.message);
    }
})

//Felhasználói adatok módosítása
async function editUser(id, firstName, lastName, city, address, phone, email, gender) {
    //Az új adatok megadása
    const newFirstName = prompt('Add meg az új vezetéknevet:', firstName);
    const newLastName = prompt('Add meg az új keresztnevet:',lastName);
    const newCity = prompt('Add meg az új települést:', city);
    const newAddress = prompt('Add meg az új címet:', address);
    const newPhone = prompt('Add meg az új telefonszámot:', phone);
    const newEmail = prompt('Add meg az új email címet:', email);
    const newGender = prompt('Add meg az új nemet:', gender);

    if (newFirstName && newLastName && newCity && newAddress && newPhone && newEmail && newGender) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: newFirstName, lastName: newLastName, city: newCity, address: newAddress, phone: newPhone, email:newEmail, gender: newGender })
            });
            if (response.ok) {
                getUsers();
            }
            else {
                console.error('Hiba történt a felhasználó adatainak a törlése során!', await response.json());
            }
        }
        catch(e) {
            console.error('Nem sikerült a felhasználó adatait frissíteni!', error);
        }
    }

}


//A felhasználói adatok törlése
async function deleteUser(id) {
    if (confirm('Valóban törölni akarod a felhasználót?')) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                getUsers();
            }
            else {
                console.error('Hiba történt a felhasználó törlése során!', await response.json());
            }
        }
        catch(error) {
            alert('Az adatok törlése sikertelen volt!')
            console.error('Az adatok törlése sikertelen volt!', error)
        }
    }
}

getUsers();