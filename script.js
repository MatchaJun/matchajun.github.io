// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCm97Jxw-CK-m3C3qCG8bIIPYDv9QmXYkc",
  authDomain: "checkin-card.firebaseapp.com",
  databaseURL: "https://checkin-card-default-rtdb.firebaseio.com",
  projectId: "checkin-card",
  storageBucket: "checkin-card.firebasestorage.app",
  messagingSenderId: "841892799276",
  appId: "1:841892799276:web:93148b585f6cd0e8de4289",
  measurementId: "G-WHDV13H81N"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Referência do Firebase Realtime Database
const checkinsRef = database.ref('checkins');

// Função para atualizar a página quando um novo check-in for adicionado
checkinsRef.on('child_added', (snapshot) => {
  const newCheckin = snapshot.val(); // Dados do check-in
  const userName = newCheckin.user; // Nome do usuário
  displayNewCheckin(userName);
});

// Função para exibir o nome do usuário no cartão e fazer o swipe
function displayNewCheckin(userName) {
  const container = document.getElementById('checkin-container');
  
  // Criar o cartão do usuário
  const checkinCard = document.createElement('div');
  checkinCard.classList.add('checkin-card');
  checkinCard.textContent = userName;

  // Adiciona o cartão ao contêiner
  container.appendChild(checkinCard);

  // Animação de swipe (simples)
  setTimeout(() => {
    checkinCard.classList.add('swiped'); // Adiciona a classe para o efeito de swipe
  }, 100); // Um pequeno delay para a animação começar após adicionar o cartão

  // Remove o cartão após o swipe
  setTimeout(() => {
    container.removeChild(checkinCard);
  }, 2000); // Remove o cartão após 2 segundos
}
