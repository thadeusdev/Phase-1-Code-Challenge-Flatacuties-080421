// // 1. See all characters names in a `div` with the id of `"character-bar"`. Create
// // a `span` tag with the character's name and add it the `div#character-bar`
// // once you have retrieved the character data from the server. You will need to
// // make a GET request to the following endpoint to retrieve the character data:
// //const BASE_URL = "http://localhost:3000/characters"
const BASE_URL = "http://localhost:3000/characters";

const characterBar = document.getElementById("character-bar");
const voteForm = document.getElementById("votes-form");
const resetBtn = document.getElementById("reset-btn");
const addCharacterForm = document.getElementById("character-form");
const characterInfoDisplay = document.querySelector(".characterInfo");
const detailInfoBox = document.getElementById("detailed-info");
const detailBoxName = document.getElementById("name");
const detailBoxImage = document.getElementById("image");
const detailBoxVotes = document.getElementById("vote-count");
const deleteCharacterBtn = document.createElement("BUTTON");
const showAddCharacterFormBtn = document.createElement("BUTTON");
showAddCharacterFormBtn.textContent = "+";
showAddCharacterFormBtn.style =
  "font-size: xx-large; border-radius: 50px; border: 1px; margin-top: 0px; height: 50px; width: 50px; flex-direction: column; align-items: center;";
characterInfoDisplay.append(showAddCharacterFormBtn);
detailInfoBox.append(deleteCharacterBtn);
deleteCharacterBtn.textContent = "Release Flatacutie";
let featuredCharacter;
let clientSideRealtimeData;
init();

function init() {
  getData(BASE_URL);
  voteForm.addEventListener("submit", addVotes);
  resetBtn.addEventListener("click", resetVotes);
  deleteCharacterBtn.addEventListener("click", preventDBClearOutCheck);
  showAddCharacterFormBtn.addEventListener("click", showAddCharacterForm);
  addCharacterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    refreshDataBeforeEdit(BASE_URL);
  });
}

function showAddCharacterForm() {
  addCharacterForm.style.visibility = "visible";
  addCharacterForm.style.height = "auto";
  showAddCharacterFormBtn.style.visibility = "hidden";
}

function getData(BASE_URL) {
  fetch(BASE_URL)
    .then((resp) => resp.json())
    .then((data) => {
      loadFirstChild(data);
      data.forEach(appendDisplayNames);
      clientSideRealtimeData = data;
      return clientSideRealtimeData;
    });
}

function refreshDataBeforeEdit(BASE_URL) {
  fetch(BASE_URL)
    .then((resp) => resp.json())
    .then((data) => {
      addNewCharacter(data);
    });
}

function appendDisplayNames(data) {
  characterBar.className = "scrolling-wrapper";
  const cBDiv = document.createElement("DIV");
  cBDiv.className = "card";
  cBDiv.id = `cBD${data.id}`;
  const cBBreak = document.createElement("BR");
  const cBImage = document.createElement("IMG");
  cBImage.src = data.image;
  cBImage.style = "height: 100px; width: 100px;";
  const cBAnchor = document.createElement("A");
  cBAnchor.href = "#";
  cBAnchor.id = `cBA${data.id}`;
  cBAnchor.style = `text-decoration:none; text-align: center;`;
  const cBSpan = document.createElement("SPAN");
  cBSpan.style = "color: white;";
  cBSpan.textContent = data.name;
  characterBar.append(cBDiv);
  cBDiv.append(cBAnchor);
  cBAnchor.append(cBImage);
  cBAnchor.append(cBBreak);
  cBAnchor.append(cBSpan);
  cBAnchor.addEventListener("click", () => displayClickedChar(data));
}

// 2. When the character in the `div#character-bar` is clicked, display the
//    character's details in the `div#detailed-info`.

function loadFirstChild(data) {
  detailBoxName.textContent = data[0].name;
  detailBoxImage.src = data[0].image;
  detailBoxVotes.textContent = data[0].votes;
  featuredCharacter = data[0];
  return featuredCharacter;
}

function displayClickedChar(data) {
  detailBoxName.textContent = data.name;
  detailBoxImage.src = data.image;
  detailBoxVotes.textContent = data.votes;
  featuredCharacter = data;
  return featuredCharacter;
}

// 3. When the `form#votes-form` is submitted, add the number of votes from
//    the input field to the character displayed in the `div#detailed-info`. **No
//    persistence is needed**.

function addVotes(event) {
  event.preventDefault();
  let voteInput = document.getElementById("votes").value;
  voteInput === ""
    ? (voteInput = 1)
    : (voteInput = document.getElementById("votes").value);
  let initialVotesCount = parseInt(detailBoxVotes.textContent, 0);
  let newVoteCount = initialVotesCount + parseInt(voteInput, 0);
  detailBoxVotes.textContent = newVoteCount;
  let updateData = {
    id: `${featuredCharacter.id}`,
    // name: `${featuredCharacter.name}`,
    // image: `${featuredCharacter.image}`,
    votes: `${newVoteCount}`
  };
  //update clicked votes without refresh because it's using old data
  updateVotesToDB(updateData);
  updateHeaderDataAfterVotesChange(newVoteCount);
  event.target.reset();
}

function updateHeaderDataAfterVotesChange(newVoteCount) {
  return (featuredCharacter.votes = newVoteCount);
}

// 1. When the Reset Votes button is clicked, reset the votes back to 0.

function resetVotes() {
  let updateData = {
    id: `${featuredCharacter.id}`,
    // name: `${featuredCharacter.name}`,
    // image: `${featuredCharacter.image}`,
    votes: 0
  };
  updateVotesToDB(updateData);
  updateHeaderDataAfterVotesChange(0);
  detailBoxVotes.textContent = 0;
}

// 2. When the `form#character-form` is submitted, add a new character to the
//    `div#character-bar`. The new character in the character bar should behave the
//    same as the other characters when clicked (its details should be displayed
//    below, and it should have functionality to add votes).
// 3. In addition to adding the character to the `div#character-bar` upon
//    submitting the form, the character's details should show up immediately in
//    the `div#detailed-info`.

function addNewCharacter(data) {
  let addCharacterNameInput = document.querySelector("#character-form #name")
    .value;
  addCharacterNameInput === ""
    ? (addCharacterNameInput = Math.floor(Math.random() * 100))
    : (addCharacterNameInput = document.querySelector("#character-form #name")
        .value);
  let addCharacterImageInput = document.getElementById("image-url").value;
  addCharacterImageInput === ""
    ? (addCharacterImageInput = `assets/PC-${Math.floor(
        Math.random() * 9
      )}.png`)
    : (addCharacterImageInput = document.getElementById("image-url").value);
  let newDataAddToDB = {
    name: `${addCharacterNameInput}`,
    image: `${addCharacterImageInput}`,
    votes: "0"
  };
  addToDB(newDataAddToDB);
  let newDataWithID = {
    id: ++clientSideRealtimeData[clientSideRealtimeData.length - 1].id,
    name: `${addCharacterNameInput}`,
    image: `${addCharacterImageInput}`,
    votes: "0"
  };
  clientSideRealtimeData = [...data, { ...newDataWithID }];

  appendDisplayNames(newDataWithID);
  featuredNewCharacterAfterAdd(newDataWithID);
  document.querySelector("#character-form #name").value = "";
  return clientSideRealtimeData;
}

function featuredNewCharacterAfterAdd(newDataWithID) {
  detailBoxName.textContent = newDataWithID.name;
  detailBoxImage.src = newDataWithID.image;
  detailBoxVotes.textContent = newDataWithID.votes;
  featuredCharacter = newDataWithID;
  return featuredCharacter;
}

// 1. When a user adds or resets the votes for a character, in addition to
//    displaying the updated votes on the page, the votes should **also** be
//    updated on the server. You will need to make a request that follows this
//    structure:

function addToDB(addData) {
  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(addData)
  })
    .then((resp) => resp.json())
    .then((data) => data);
}

function updateVotesToDB(updateData) {
  fetch(`${BASE_URL}/${updateData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  })
    .then((resp) => resp.json())
    .then((data) => data.votes);
}

function preventDBClearOutCheck() {
  if (clientSideRealtimeData.length > 1) {
    deleteFeaturedCharacter();
  } else {
    console.log("There always must be ONE!");
    return clientSideRealtimeData;
  }
}

function deleteFeaturedCharacter() {
  document.getElementById(`cBD${featuredCharacter.id}`).remove();
  //pushing ids to an index so i can index which object gets deleted when client removes character
  let indexArrayClientCharacters = [];
  clientSideRealtimeData.forEach((element) =>
    indexArrayClientCharacters.push(element.id)
  );
  const indexFoundAt = indexArrayClientCharacters.findIndex(
    (element) => element === featuredCharacter.id
  );
  clientSideRealtimeData.splice(indexFoundAt, 1);
  // ^^ABOVE^^ removed the element from clientside
  deleteFromDB(featuredCharacter);
  displayNextCharacter(indexFoundAt);
  return clientSideRealtimeData;
}

function displayNextCharacter(indexBeforeDeletion) {
  if (indexBeforeDeletion >= 0) {
    if (clientSideRealtimeData[indexBeforeDeletion] !== undefined) {
      featuredCharacter = clientSideRealtimeData[indexBeforeDeletion];
      detailBoxName.textContent =
        clientSideRealtimeData[indexBeforeDeletion].name;
      detailBoxImage.src = clientSideRealtimeData[indexBeforeDeletion].image;
      detailBoxVotes.textContent =
        clientSideRealtimeData[indexBeforeDeletion].votes;
      return featuredCharacter;
    } else {
      featuredCharacter =
        clientSideRealtimeData[clientSideRealtimeData.length - 1];
      detailBoxName.textContent =
        clientSideRealtimeData[clientSideRealtimeData.length - 1].name;
      detailBoxImage.src =
        clientSideRealtimeData[clientSideRealtimeData.length - 1].image;
      detailBoxVotes.textContent =
        clientSideRealtimeData[clientSideRealtimeData.length - 1].votes;
      return featuredCharacter;
    }
  } else {
    featuredCharacter = clientSideRealtimeData[0];
    detailBoxName.textContent = clientSideRealtimeData[0].name;
    detailBoxImage.src = clientSideRealtimeData[0].image;
    detailBoxVotes.textContent = clientSideRealtimeData[0].votes;
    return featuredCharacter;
  }
}

function deleteFromDB(featuredCharacter) {
  fetch(`${BASE_URL}/${featuredCharacter.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
}
