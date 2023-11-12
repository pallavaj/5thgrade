let mymessage = "Welcome"

let endMsg = "Awesome! No words remaining"
let voiceSelect = document.createElement("select");
voiceSelect.setAttribute('id', 'voiceSelect');
let subpages = document.querySelector('.subpages');
    subpages.before(voiceSelect);

let msg = new SpeechSynthesisUtterance();
const synth = window.speechSynthesis;
let voices = synth.getVoices();
console.log(voices);
if(voices.length){
    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement('option');
        option.textContent = `${voices[i].name} (${voices[i].lang})`;
    
        if (voices[i].default) {
          option.textContent += ' — DEFAULT';
        }
    
        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        document.getElementById("voiceSelect").appendChild(option);
      }
}else{
synth.onvoiceschanged = function() {
    voices = synth.getVoices();
    console.log(voices);
    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement('option');
        option.textContent = `${voices[i].name} (${voices[i].lang})`;
    
        if (voices[i].default) {
          option.textContent += ' — DEFAULT';
        }
    
        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        document.getElementById("voiceSelect").appendChild(option);
      }

};
}

//<select id="voiceSelect"></select>


function readAWord() {
    let lessonChoosen = document.querySelector("#chooseLesson").value;

    if(lessonChoosen != "4"){
        //Read from local storage and update array
        let spellingWords = localStorage.getItem("spellingBee_"+lessonChoosen);
        try {
            spellingBee[lessonChoosen] = spellingWords ? JSON.parse(spellingWords) : spellingBee[lessonChoosen];
        } catch (error) {
            console.log("Not found");
        }
    }
    //complete read from local storage

    if (spellingBee[lessonChoosen].length) {
        msg.text = spellingBee[lessonChoosen].splice(spellingBee[lessonChoosen].length * Math.random() | 0, 1)[
            0];
    } else {
        //document.getElementById("btn-next").setAttribute("data-disabled","disabled")
        msg.text = endMsg;
    }
    if(lessonChoosen != "4"){
        //Write to local storage
        localStorage.setItem("spellingBee_"+lessonChoosen, JSON.stringify(spellingBee[lessonChoosen]));
    }
    mymessage = msg.text;
    let mylabel = document.getElementById("spellingBee");
    mylabel.innerText = msg.text;
    addhelpLinks(mylabel,msg.text)

    //Voice selection
    let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    console.log(selectedOption);
    //msg.voice = voices.find((v) => v.name === selectedOption);
    //Voice selection end

    window.speechSynthesis.speak(msg);

    if (msg.text !== endMsg) {
        let anchor = document.createElement("a");
        anchor.setAttribute('onclick', 'speakLoud("' + msg.text + '")');
        anchor.setAttribute('class', 'speakWord');
        anchor.innerText = msg.text;
        anchor.href = "javascript:void(0)";
        document.getElementById("history").prepend(anchor);
    }
    try {
        let definition = document.getElementById('_definitions_');
        definition.innerHTML = '';
        let count = document.getElementById('_count_');
        if(count)count.innerHTML = spellingBee[lessonChoosen].length;
    } catch (error) {
        
    }
    
}

function repeatWord() {
    msg.text = mymessage;
    //Voice selection
    let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    console.log(selectedOption);
    //msg.voice = voices.find((v) => v.name === selectedOption);
    //Voice selection end
    window.speechSynthesis.speak(msg);
}
function readSpelling(){
    let a = mymessage.split("");
    let b = a.toString()
    let c = b.replaceAll(",", ", ");
    msg.text = c;
    window.speechSynthesis.speak(msg);

}
/**
 * task = null, 0 //Add
 * task = -1, // remove
 * **/
function addRemoveRetest(task) {
    let retestWordsStorage = localStorage.getItem("retestWords");
    let retestWords = [];
    try {
        retestWords = retestWordsStorage ? JSON.parse(retestWordsStorage) : [];
    } catch (error) {
        retestWords = [];
    }

    let currentIndex = retestWords.indexOf(msg.text)

    if (task != '-1' && task != -1) {
        if (currentIndex == -1 && msg.text != endMsg) {
            retestWords.push(msg.text)
        }
    } else {
        if (currentIndex != -1) {
            retestWords.splice(currentIndex, 1);
        }
    }
    localStorage.setItem("retestWords", JSON.stringify(retestWords));
    setRetestWords();
    printSpellingList(4);
    
}

function setRetestWords() {
    let retestWordsStorage = localStorage.getItem("retestWords");
    let retestWords = [];
    try {
        retestWords = retestWordsStorage ? JSON.parse(retestWordsStorage) : [];
    } catch (error) {
        retestWords = [];
    }
    spellingBee[4] = retestWords;
}

function printSpellingList(idx) {
    let divElem = document.createElement('div');
    spellingBee[idx].sort();

    let reset_anchor = document.createElement("a");
    reset_anchor.setAttribute('onclick', 'resetStorage("' + idx + '")');
    reset_anchor.setAttribute('class', 'resetWordList');
    reset_anchor.innerText = "Refresh "+(idx+1);
    reset_anchor.href = "javascript:void(0)";
    divElem.appendChild(reset_anchor);

    for (let i = 0; i < spellingBee[idx].length; i++) {
        let anchor = document.createElement("a");
        anchor.setAttribute('onclick', 'speakLoud("' + spellingBee[idx][i] + '")');
        anchor.setAttribute('class', 'speakWord');
        anchor.innerText = spellingBee[idx][i];
        anchor.href = "javascript:void(0)";

        divElem.appendChild(anchor);
    }
    let spellingLists = document.getElementById("spellingList" + idx);
    spellingLists.replaceChildren();
    spellingLists.appendChild(divElem);
}
function resetStorage(idx){
    localStorage.removeItem("spellingBee_"+idx);
    window.location.reload();
}
function resetStorageAll(){
    try {
        localStorage.removeItem("spellingBee_0");
        localStorage.removeItem("spellingBee_1");
        localStorage.removeItem("spellingBee_2");
        localStorage.removeItem("spellingBee_3");
        localStorage.removeItem("spellingBee_4");
        window.location.reload();
    } catch (error) {
        window.location.reload();
    }

}


function speakLoud(txtmsg) {
    msg.text = txtmsg;
    let mylabel = document.getElementById("spellingBee");
    mylabel.innerText = msg.text;
    addhelpLinks(mylabel, msg.text)

    //Voice selection
    let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    console.log(selectedOption);
    //msg.voice = voices.find((v) => v.name === selectedOption);
    //Voice selection end


    window.speechSynthesis.speak(msg);
    if (msg.text !== endMsg) {
        let anchor = document.createElement("a");
        anchor.setAttribute('onclick', 'speakLoud("' + msg.text + '")');
        anchor.setAttribute('class', 'speakWord');
        anchor.innerText = msg.text;
        anchor.href = "javascript:void(0)";
        document.getElementById("history").prepend(anchor);
    }
    try {
        let definition = document.getElementById('_definitions_');
        definition.innerHTML = '';
    
    } catch (error) {
        
    }
}
function addhelpLinks(mylabel, txt){
    let mw_link =  document.getElementById("mw_link");
    let google_link =  document.getElementById("google_link");
    if(google_link == null){
        google_link = document.createElement("a")
        google_link.setAttribute('id', 'google_link');
        mylabel.after(google_link);     
    }
    if(mw_link == null){
        mw_link = document.createElement("a")
        mw_link.setAttribute('id', 'mw_link');
        mylabel.after(mw_link);
    }
    google_link.setAttribute('href', 'https://www.google.com/search?q='+encodeURI(txt))
    google_link.setAttribute('target', '_blank');
    google_link.innerText = "Google Search";

    mw_link.setAttribute('href', 'https://www.merriam-webster.com/dictionary/'+encodeURI(txt))
    mw_link.setAttribute('target', '_blank');
    mw_link.innerText = "Dictionary";
}
