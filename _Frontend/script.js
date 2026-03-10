//GLOBAL VARIABLES
let register_button1 = document.getElementById("register_button1");
let register_button2 = document.getElementById("register_button2");
let email_input = document.getElementById("email_input");
let name_input = document.getElementById("name_input");
let password_input = document.getElementById("password_input");
let login_button = document.getElementById("login_button");
let title = document.getElementById("hp_title");
let subtitle = document.getElementById("hp_subtitle");
//HTML ELEMENTS

//FUNCTIONS
//EVENT-LISTENERS

register_button1.addEventListener("click", () => {
    register_button1.classList.add("hidden");
    login_button.classList.add("hidden");
    title.style.fontSize = "4.5em";
    subtitle.classList.add("hidden");
    register_button2.classList.remove("hidden");
    document.getElementById("register_container").classList.remove("hidden");
});

register_button2.addEventListener("click", () => {
    let currentEmail = email_input.value;
    if (!currentEmail.includes("@") || currentEmail.split("@")[1].toLowerCase() != "kantiolten.ch") {
        alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
    }
    let fetchPromise = fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username_input.value,
            password: password_input.value,
            email: email_input.value,
            name: name_input.value,
            surname: surname_input.value
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
    register_button1.classList.remove("hidden");
    register_button2.classList.add("hidden");
    document.getElementById("register_container").classList.add("hidden");
    login_button.classList.remove("hidden");
    subtitle.classList.remove("hidden");
});
