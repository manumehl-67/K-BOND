//GLOBAL VARIABLES
//HTML ELEMENTS
let hp_title = document.createElement("h1");
hp_title.id = "hp_title";
hp_title.innerText = "K-BOND";
document.body.appendChild(hp_title);

let hp_subititle = document.createElement("h2");
hp_subititle.id = "hp_subtitle";
hp_subititle.innerText = "Bond with your fellow Kanti mates!";
document.body.appendChild(hp_subititle);

let login_button = document.createElement("button");
login_button.id = "login_button";
login_button.classList = "buttons"
login_button.innerText = "login";
document.body.appendChild(login_button);

let register_button = document.createElement("button");
register_button.id = "register_button";
register_button.classList = "buttons";
register_button.innerText = "register";
document.body.appendChild(register_button);

let name_input = document.createElement("input");
name_input.id = "name_input";
name_input.placeholder = "Username";
document.body.appendChild(name_input);

let email_input = document.createElement("input");
email_input.id = "email_input";
email_input.placeholder = "E-Mail";
document.body.appendChild(email_input);

let password_input = document.createElement("input");
password_input.id = "password_input";
password_input.placeholder = "Password";
password_input.type = "password";
document.body.appendChild(password_input);

//FUNCTIONS
//EVENT-LISTENERS
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
