//GLOBAL VARIABLES
//HTML ELEMENTS

//FUNCTIONS
//EVENT-LISTENERS
let register_button = document.getElementById("register_button");
let email_input = document.getElementById("email_input");
let name_input = document.getElementById("name_input");
let password_input = document.getElementById("password_input");

register_button.addEventListener("click", () => {
    let currentEmail = email_input.value;
    if (!currentEmail.includes("@") || currentEmail.split("@")[1].toLowerCase() != "kantiolten.ch") {
        alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
    }
    let fetchPromise = fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: name_input.value,
            password: password_input.value
        })
    });

    fetchPromise.then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Fehler bei der Registrierung');
        }
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.error('Fehler:', error);
    });
});
