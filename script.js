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

const checkinQueue = []; // Fila de check-ins
let isDisplaying = false; // Controle de exibição

// Escuta novos check-ins em tempo real
onChildAdded(checkinsRef, (snapshot) => {
    const data = snapshot.val();
    checkinQueue.push(data); // Adiciona o check-in à fila
    processQueue(); // Processa a fila
});

function processQueue() {
    if (isDisplaying || checkinQueue.length === 0) return;

    isDisplaying = true;
    const data = checkinQueue.shift(); // Pega o próximo check-in da fila
    exibirCheckin(data.user, data.imagemURL, () => {
        isDisplaying = false;
        processQueue(); // Chama a próxima exibição após o tempo de exibição
    });
}

function exibirCheckin(userName, imageUrl, callback) {
    const checkinsDiv = document.getElementById("checkins");
    
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundImage = `url(${imageUrl})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";

    const text = document.createElement("p");
    text.textContent = `${userName} fez check-in!`;
    text.classList.add("checkin-text");

    card.appendChild(text);
    checkinsDiv.appendChild(card);

    // Remove o cartão depois de 5 segundos e chama o callback
    setTimeout(() => {
        card.classList.add("exit"); // Adiciona classe de saída
        setTimeout(() => {
            card.remove();
            callback(); // Chama o callback para exibir o próximo check-in
        }, 500); // Tempo da animação de saída
    }, 5000);
}
