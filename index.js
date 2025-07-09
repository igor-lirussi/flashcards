let studySets = document.querySelector("#studySets");
let createBtn = document.querySelector('#createBtn');

let currentSet = -1;

const jsonFiles = [
  'json/set1.json',
];

//This function will load the sets onto the homepage from local storage.
function loadHome(){
    //load json
    jsonFiles.forEach((path, index) => {
        fetch(path)
          .then(response => response.json())
          .then(data => {
            if (!data[0]?.title) {
              console.warn(`File ${path} ha formato errato.`);
              return;
            }

            // Evita duplicazioni se già caricato
            const numSets = parseInt(localStorage.getItem('set#') || '0');
            for (let i = 1; i <= numSets; i++) {
              const set = localStorage.getItem(i);
              if (set && JSON.stringify(data) === set) {
                console.log(`Set già caricato: ${data[0].title}`);
                return;
              }
            }

            const newSetNumber = numSets + 1;
            localStorage.setItem('set#', newSetNumber);
            localStorage.setItem(newSetNumber, JSON.stringify(data));
            console.log(`Set ${data[0].title} caricato con successo.`);
            loadHome(); // aggiorna la lista
          })
          .catch(err => console.error(`Errore caricamento ${path}`, err));
    });
    //keep going
    const numOfSets = localStorage.getItem('set#');
    if(numOfSets > 0){
        for(let i = 1; i <= numOfSets; i++ ){
            let setData = JSON.parse(localStorage.getItem(i));
            let setTitle = setData[0]['title'];
            let set = document.createElement('div');
            let setHeader = document.createElement('div');
            // let setEdit = document.createElement('a');
            let setDelete = document.createElement('span');
            let setLink = document.createElement('a');
            // setEdit.classList.add('setEdit');
            // setEdit.textContent = 'Edit';
            // setEdit.addEventListener('click', () => editSetData(i));
            // setEdit.href = "create.html";
            setDelete.classList.add('setDelete');
            setDelete.textContent = "X"
            setDelete.addEventListener('click', () => deleteSet(i, set));
            // setHeader.appendChild(setEdit);
            setHeader.appendChild(document.createElement('span'));
            setHeader.appendChild(setDelete);
            setHeader.classList.add('setHeader');
            setLink.classList.add('setLink');
            setLink.textContent = setTitle;
            setLink.href = 'flashcard.html';
            setLink.addEventListener('click', () => loadSetData(i));
            set.classList.add('set');
            set.appendChild(setHeader);
            set.appendChild(setLink);
            studySets.removeChild(createBtn);
            studySets.appendChild(set);
            studySets.appendChild(createBtn);
    
        }
    }
}

function deleteSet(setNumber, div){
    if(currentSet === setNumber){
        localStorage.removeItem("cards");
        localStorage.removeItem("currentTitle");
        currentSet = -1;
    }
    studySets.removeChild(div);
    localStorage.removeItem(setNumber);
    let numSets = localStorage.getItem("set#");
    for(let i = 1; i <=  numSets; i++){
        if(i > setNumber){
            let oldKey = i;
            let newKey = i-1;
            localStorage.setItem(newKey, localStorage.getItem(oldKey));
            localStorage.removeItem(oldKey);
            console.log("Set " + oldKey + "is now set" + newKey)
        }
    }
    localStorage.setItem('set#', numSets-=1);
}
//Executes when a set is slected from home,loads the terms, definition of the chosen set.
function loadSetData(setNumber){
    console.log(setNumber);
    currentSet = setNumber; 
    let data = JSON.parse(localStorage.getItem(currentSet));
    let title = data[0]['title'];
    let cards = [];
    for(let i = 1; i < data.length; i++){
        let term = Object.keys(data[i])[0];
        let definition = data[i][term];
        let kvp = {};
        kvp[term] = definition;
        cards.push(kvp);
    }
    localStorage.setItem('currentTitle', title);
    localStorage.setItem('cards', JSON.stringify(cards));
    localStorage.setItem('currentSet', setNumber);
}

//main
loadHome();

//Edits existing set;
// function editSetData(setNumber){
//     console.log(setNumber);
//     currentSet = setNumber;
//     let terms = [];
//     let definitions = [];   
//     let data = JSON.parse(localStorage.getItem(currentSet));
//     let title = data[0]['title'];
//     for(let i = 1; i < data.length; i++){
//         let term = Object.keys(data[i])[0];
//         let definition = (data[i])[term];
//         terms.push(term);
//         definitions.push(definition);
//     }
//     localStorage.setItem('editTitle', title);
//     localStorage.setItem('editTerms', JSON.stringify(terms));
//     localStorage.setItem('editDefinitions', JSON.stringify(definitions));
//     localStorage.setItem('editCurrentSet', setNumber);
//     localStorage.setItem('editting', 'true');
// }
//Executes when the delete button is clicked, removes set data from localStorage.