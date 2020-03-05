const { ipcRenderer } = require('electron');
const fs = require('fs');

let defaultFontSize = 20;
let textareaContent = document.querySelector("#textarea");
let errorBox = document.querySelector("#errorBox");
let successBox = document.querySelector("#successBox");
// controlling the font size of the content in the screen
function changeFontSize(status) {
    if (status === "increase") {
        textareaContent.style.fontSize = `${++defaultFontSize}px`;
    } else if (status === "decrease") {
        textareaContent.style.fontSize = `${--defaultFontSize}px`;
    } else {
        textareaContent.style.fontSize = "1rem";
    }
}
let plusBtn = document.querySelector("#plus");
let minusBtn = document.querySelector("#minus");
plusBtn.addEventListener('click', e => {
    e.preventDefault();
    changeFontSize("increase");
});
minusBtn.addEventListener('click', e => {
    e.preventDefault();
    changeFontSize("decrease");
});

// save btn action
let content = "";
let saveBtn = document.querySelector("#save");
saveBtn.addEventListener('click', e => {
    // get the content of the textarea
    content = document.querySelector('#textarea').value;
    // ipc renderer sending the message to the ipc main
    // sending the text content to the ipc main
    ipcRenderer.send("content",content);
    textareaContent.value = "";
});

ipcRenderer.on('status',(e,args)=>{
    if(args === "success"){
        showMessage(args);
    }
    if(args === "failure"){
        showMessage(args);
    }
});

function showMessage(status){
    if(status === "failure"){
        errorBox.style.display = "block";
    }
    if(status === "success"){
        successBox.style.display = "block";
    }
    setTimeout(()=>{
        if(status === "failure"){
            errorBox.style.display = "none";
        }
        if(status === "success"){
            successBox.style.display = "none";
        }
    },1500);
}

// listening to opening the file from ipcMain
ipcRenderer.on('openFilePath',(e,args)=>{
    if(args){
        let filePath = args[0];
        console.log(filePath);
        let content = fs.readFileSync(filePath,'utf-8');
        textareaContent.value = "Loading....";
        if(content){
            textareaContent.value = content;
        }else{
            textareaContent.value = "Sorry Cannot Open!";
        }
    }
});
