// Configuração do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCm97Jxw-CK-m3C3qCG8bIIPYDv9QmXYkc",
    authDomain: "checkin-card.firebaseapp.com",
    databaseURL: "https://checkin-card-default-rtdb.firebaseio.com/",
    projectId: "checkin-card",
    storageBucket: "checkin-card.firebasestorage.app",
    messagingSenderId: "841892799276",
    appId: "1:841892799276:web:93148b585f6cd0e8de4289",
    measurementId: "G-WHDV13H81N"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const checkinsRef = ref(database, "checkins");

// Escuta novos check-ins em tempo real
onChildAdded(checkinsRef, (snapshot) => {
    const data = snapshot.val();
    exibirCheckin(data.user, data.imagemURL);
});

function exibirCheckin(userName, imageUrl) {
    const checkinsDiv = document.getElementById("checkins");

    // Cria o elemento do cartão
    const card = document.createElement("div");
    card.classList.add("card");

    // Define a imagem como fundo do cartão
    card.style.backgroundImage = `url(${imageUrl})`;

    // Cria o texto do nome
    const text = document.createElement("p");
    text.textContent = `${userName}`;
    
    // Adiciona o texto ao cartão
    card.appendChild(text);

    // Adiciona o cartão à tela
    checkinsDiv.appendChild(card);

    // Remove o cartão depois de 5 segundos
    setTimeout(() => {
        card.remove();
    }, 5000);
}
