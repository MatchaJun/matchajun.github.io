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

// Web Audio API setup
let audioContext;
let audioBuffer;

window.onload = () => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  fetch("https://matchajun.github.io/bell_ring.mp3")
    .then(response => response.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer))
    .then(decoded => {
      audioBuffer = decoded;
    })
    .catch(error => console.warn("Erro ao carregar som:", error));
};

function tocarSom() {
  if (!audioContext || !audioBuffer) return;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

// Escuta novos check-ins
onChildAdded(checkinsRef, (snapshot) => {
  const data = snapshot.val();
  checkinQueue.push({ firebaseKey: snapshot.key, ...data });
  processQueue();
});

function processQueue() {
  if (isDisplaying || checkinQueue.length === 0) return;

  isDisplaying = true;
  const checkin = checkinQueue.shift();

  if (!checkin || !checkin.firebaseKey || !checkin.user || !checkin.imageUrl) {
    isDisplaying = false;
    processQueue();
    return;
  }

  const { firebaseKey, user, imageUrl, checkinCount } = checkin;

  exibirCheckin(user, imageUrl, checkinCount || 1, () => {
    const checkinRef = ref(database, `checkins/${firebaseKey}`);
    remove(checkinRef).then(() => {
      isDisplaying = false;
      processQueue();
    }).catch(error => {
      console.error("Erro ao remover check-in:", error);
      isDisplaying = false;
      processQueue();
    });
  });
}

function exibirCheckin(userName, imageUrl, checkinCount, callback) {
  const checkinsDiv = document.getElementById("checkins");

  const card = document.createElement("div");
  card.classList.add("card");
  card.style.backgroundImage = `url(${imageUrl})`;
  card.style.backgroundSize = "cover";
  card.style.backgroundPosition = "center";

  const nameText = document.createElement("div");
  nameText.classList.add("checkin-text");

  const nameBg = document.createElement("div");
  nameBg.classList.add("checkin-bg");

  const nameSpan = document.createElement("span");
  nameSpan.textContent = userName;

  nameText.appendChild(nameBg);
  nameText.appendChild(nameSpan);

  const countText = document.createElement("div");
  countText.classList.add("checkin-count");

  const countBg = document.createElement("div");
  countBg.classList.add("checkin-bg");

  const countSpan = document.createElement("span");
  countSpan.textContent = `#${checkinCount}`;

  countText.appendChild(countBg);
  countText.appendChild(countSpan);

  card.appendChild(nameText);
  card.appendChild(countText);
  checkinsDiv.appendChild(card);
  
  setTimeout(() => {
    card.classList.add("shine");
  }, 600);

  //tocarSom();

  setTimeout(() => {
    card.classList.remove("shine");
    card.classList.add("exit");
    setTimeout(() => {
      card.remove();
      callback();
    }, 1000);
  }, 5000);
}

// Teste local
exibirCheckin("fernando", "https://i.imgur.com/ADhloh0.png", 99, () => {});
