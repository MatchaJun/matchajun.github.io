function exibirCheckin(userName, imageUrl, checkinCount, callback) {
  const checkinsDiv = document.getElementById("checkins");

  const card = document.createElement("div");
  card.classList.add("card");
  card.style.backgroundImage = `url(${imageUrl})`;
  card.style.backgroundSize = "cover";
  card.style.backgroundPosition = "center";

  const textContainer = document.createElement("div");
  textContainer.classList.add("checkin-info");

  const nameText = document.createElement("p");
  nameText.textContent = `${userName}`;
  nameText.classList.add("checkin-text");

  const countText = document.createElement("p");
  countText.textContent = `#${checkinCount}`;
  countText.classList.add("checkin-count");

  textContainer.appendChild(nameText);
  textContainer.appendChild(countText);
  card.appendChild(textContainer);
  checkinsDiv.appendChild(card);

  setTimeout(() => {
    card.classList.add("exit");
    setTimeout(() => {
      card.remove();
      callback();
    }, 1000);
  }, 5000);
}

onChildAdded(checkinsRef, (snapshot) => {
  const data = snapshot.val();
  checkinQueue.push({
    firebaseKey: snapshot.key,
    ...data
  });
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
