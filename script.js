// Função para atualizar o nome do usuário no cartão
function updateCheckinCard(userName) {
    document.getElementById("username").innerText = userName;
    document.getElementById("checkinCard").style.animation = "swipe-in 1s forwards";
}

// Simula a chamada do Google Apps Script
function listenForCheckins() {
    // Aqui seria a lógica que ouviria o Google Apps Script ou outra fonte
    // Exemplo: Quando um usuário faz check-in
    updateCheckinCard("Nome do Usuário");
}

window.onload = listenForCheckins;
