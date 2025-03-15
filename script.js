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
    const { key, user, imagemURL } = checkinQueue.shift();
    
    exibirCheckin(user, imagemURL, () => {
        remove(ref(database, checkins/${key})); // 🔥 Remove do Firebase depois de exibir
        isDisplaying = false;
        processQueue();
    });
}

function exibirCheckin(userName, imageUrl, callback) {
    const checkinsDiv = document.getElementById("checkins");

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.backgroundImage = url(${imageUrl});
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";

    const text = document.createElement("p");
    text.textContent = ${userName} fez check-in!;
    text.classList.add("checkin-text");

    card.appendChild(text);
    checkinsDiv.appendChild(card);

    setTimeout(() => {
        card.classList.add("exit");
        setTimeout(() => {
            card.remove();
            callback(); // 🔥 Continua a fila depois de remover do Firebase
        }, 1000);
    }, 5000);
}
