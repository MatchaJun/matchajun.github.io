import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Configuração do Firebase
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

const checkinQueue = [];
let isDisplaying = false;

// Escuta novos check-ins
onChildAdded(checkinsRef, (snapshot) => {
    const data = snapshot.val();
    checkinQueue.push({ key: snapshot.key, ...data }); // 🔥 Guarda a chave do check-in
    processQueue();
});

function processQueue() {
    if (isDisplaying || checkinQueue.length === 0) return;

    isDisplaying = true;
    const { key, user, imagemURL, imagemVersoURL } = checkinQueue.shift();
    
    exibirCheckin(user, imagemURL, imagemVersoURL, () => {
        remove(ref(database, `checkins/${key}`)); // 🔥 Remove do Firebase depois de exibir
        isDisplaying = false;
        processQueue();
    });
}

function exibirCheckin(userName, frontImageUrl, backImageUrl, callback) {
    const checkinsDiv = document.getElementById("checkins");

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    const card = document.createElement("div");
    card.classList.add("card");

    const frontFace = document.createElement("div");
    frontFace.classList.add("card-face", "card-front");
    frontFace.style.backgroundImage = `url(${frontImageUrl})`;

    const backFace = document.createElement("div");
    backFace.classList.add("card-face", "card-back");
    backFace.style.backgroundImage = `url(${backImageUrl})`;

    const text = document.createElement("p");
    text.textContent = `${userName} fez check-in!`;
    text.classList.add("checkin-text");

    frontFace.appendChild(text);
    card.appendChild(frontFace);
    card.appendChild(backFace);
    cardContainer.appendChild(card);
    checkinsDiv.appendChild(cardContainer);

    // Aguarda um tempo e faz o flip
    setTimeout(() => {
        card.classList.add("flipped");

        // Após 3s, inicia a saída
        setTimeout(() => {
            card.classList.add("exit");

            setTimeout(() => {
                cardContainer.remove();
                callback(); // 🔥 Continua a fila depois de remover do Firebase
            }, 1000);
        }, 3000);

    }, 2500);
}
