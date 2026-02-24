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

//FUNCTIONS
//EVENT-LISTENERS