const userJson = localStorage.getItem("loggedInUser");

if (userJson) {
    const user = JSON.parse(userJson);
    
    // Prüfe, ob dein Backend 'name', 'username' oder 'surname' sendet.
    // Ich nutze hier 'name', pass es ggf. an das an, was in deiner DB steht.
    const displayName = user.name + " " + user.surname || user.username || "User";
    
    document.getElementById("welcome_text").innerText = `Welcome back, ${displayName}!`;
} else {
    // Falls kein User im Speicher ist -> zurück zum Login
    window.location.href = 'index.html';
}

// LOGOUT FUNKTION
document.getElementById("logout_button").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser"); // Speicher leeren
    window.location.href = 'index.html';    // Zurück zum Login
});