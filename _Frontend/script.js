//GLOBAL VARIABLES
let register_button1 = document.getElementById("register_button1");
let registry_title = document.getElementById("registry_title");
let register_button2 = document.getElementById("register_button2");
let username_input = document.getElementById("username_input");
let email_input = document.getElementById("email_input");
let name_input = document.getElementById("name_input");
let password_input = document.getElementById("password_input");
let login_button = document.getElementById("login_button");
let title = document.getElementById("hp_title");
let subtitle = document.getElementById("hp_subtitle");
let register_container = document.getElementById("register_container");
let login_container = document.getElementById("login_container");
let login_username_input = document.getElementById("login_username");
let login_password_input = document.getElementById("login_password");
let login_button_submit = document.getElementById("login_button2"); // Der "Login"-Button im Container
let user_profile = document.getElementById("user_profile");
let welcome_text = document.getElementById("welcome_text");
let logout_button = document.getElementById("logout_button");

// Check beim Laden der Seite
window.addEventListener("load", () => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
        const user = JSON.parse(savedUser); // Text wieder in Objekt umwandeln
        updateUI(user);
    }
});

//HTML ELEMENTS

//FUNCTIONS

function updateUI(user) {
    // Verstecke Start-Elemente
    title.classList.add("hidden");
    subtitle.classList.add("hidden");
    login_button.classList.add("hidden");
    register_button1.classList.add("hidden");
    login_container.classList.add("hidden");
    registry_title.classList.add("hidden");

    // Zeige Profil oben rechts
    user_profile.classList.remove("hidden");
    welcome_text.innerText = "Willkommen zurück, " + user.surname + "!";
}
//EVENT-LISTENERS

register_button1.addEventListener("click", () => {
    title.classList.add("hidden");
    register_button1.classList.add("hidden");
    login_button.classList.add("hidden");
    subtitle.classList.add("hidden");
    register_container.classList.remove("hidden");
    registry_title.classList.remove("hidden");
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
    register_container.classList.add("hidden");
    registry_title.classList.add("hidden");
    login_button.classList.remove("hidden");
    subtitle.classList.remove("hidden");
    title.classList.remove("hidden");
});

registry_title.addEventListener("click", () => {
    register_container.classList.add("hidden");
    register_button1.classList.remove("hidden");
    login_button.classList.remove("hidden");
    subtitle.classList.remove("hidden");
    registry_title.classList.add("hidden");
    title.classList.remove("hidden");
    login_container.classList.add("hidden");
});

login_button.addEventListener("click", () => {
    title.classList.add("hidden");
    register_button1.classList.add("hidden");
    login_container.classList.remove("hidden");
    login_button.classList.add("hidden");
    subtitle.classList.add("hidden");
    registry_title.classList.remove("hidden");
});

login_button_submit.addEventListener("click", () => {
    const data = {
        username: login_username_input.value,
        password: login_password_input.value
    };

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Wir erwarten ein JSON vom Server bei Erfolg
            } else {
                throw new Error('Login fehlgeschlagen');
            }
        })
        .then(userData => {
            // Neu: Daten im Browser merken
            localStorage.setItem("loggedInUser", JSON.stringify(userData.user));

            // UI aktualisieren (wie bisher)
            updateUI(userData.user);
        })
        .catch(error => {
            alert("Fehler: Benutzername oder Passwort falsch.");
            console.error('Login-Fehler:', error);
        });
});

logout_button.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser"); // Speicher leeren
    location.reload(); // Seite frisch laden
});