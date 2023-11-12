let sentence = new SpeechSynthesisUtterance();
//const baseurl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const baseurl = 'https://www.dictionaryapi.com/api/v3/references/sd4/json/'
const learnerKey = '625403ae-a4e0-499b-a440-23e4ead433fc';
const definition = document.getElementById('_definitions_');
// const fetchWordDefinitions = async word => {
//     console.log(`Making request for definitions of ${word}...`);
//     const response = await fetch(baseurl + word + '?key='+ learnerKey);
//     const json = await response.json();
//     return json[0].meanings
//         .flatMap(m => m.definitions)
//         .flatMap(d => d.definition);
// };
const fetchWordDefinitions = async word => {
    console.log(`Making request for definitions of ${word}...`);
    const response = await fetch(baseurl + word + '?key='+ learnerKey);
    const json = await response.json();
    return json.flatMap(m => m.shortdef);
    
        //    return json[0].shortdef;
       // .flatMap(m => m.definitions)
       // .flatMap(d => d.definition);
};
const getWordDefinitions = () => {
    const word = msg.text;
    if (word == null || word == '') {
        return alert('Error: You must enter a word to fetch');
    }
    definition.innerHTML = '';
    fetchWordDefinitions(word)
        .then(defintions => {
            defintions.forEach(d => {
                definition.innerHTML += `<p onclick="readSentence(this)">${d}</p>`;
            });
        })
        .catch(_ => {
            definition.innerHTML += `<p>Error: Could not retrive any defintions for ${word}.</p>`;
        });
};

function readSentence(obj) {
    sentence.text = obj.innerText;
    //Voice selection
    let voiceSelect = document.getElementById("voiceSelect");
    let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    console.log(selectedOption);
    ////msg.voice = voices.find((v) => v.name === selectedOption);
    //Voice selection end    
    window.speechSynthesis.speak(sentence);
}

function stopReload(){
    return confirm("Reload ??? Reset ?? \n r OK or Cancel.");
}
