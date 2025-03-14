function updateCheckinCard(userName) {
    document.getElementById("username").innerText = userName;
    document.getElementById("checkinCard").style.animation = "swipe-in 1s forwards";
}

// Função para obter o parâmetro 'user' da URL
function getUserFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('user');
}

function listenForCheckins() {
    const user = getUserFromUrl();
    if (user) {
        updateCheckinCard(user);
    }
}

window.onload = listenForCheckins;
