const electron = require('electron');
const {app,BrowserWindow,ipcMain,dialog,Menu} = electron;
const fs = require('fs');

let mainWindow;
let filepath = undefined;
let openFilePath;
app.on('ready',()=>{
    mainWindow = new BrowserWindow({
        title:'Text Edit App!',
        webPreferences:{
            nodeIntegration:true,
        },
    });
    let menu = Menu.buildFromTemplate([
        {
            label:'File',
            submenu:[
                {
                    label:'Open File',
                    accelerator:process.platform==="darwin"?"Cmd+O":"Ctrl+O",
                    click(){
                        openFilePath = "";
                        openFilePath = dialog.showOpenDialogSync(mainWindow,{
                            properties:['openFile']
                        });
                        if(openFilePath){
                            mainWindow.webContents.send("openFilePath",openFilePath);
                        };
                    }
                },
                {
                    label:'Reload App',
                    accelerator:process.platform==="darwin"?"Cmd+R":"Ctrl:R",
                    click(){
                        mainWindow.reload();
                    }
                },
                {
                    label:'Exit Application',
                    accelerator:process.platform==="darwin"?"Cmd+Q":"Ctrl+Q",
                    click(){
                        app.quit();
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);
    // laoding the html content of this window
    mainWindow.loadFile('index.html');

    // opening the dev tools
    // mainWindow.webContents.openDevTools();

    // upon close the mainWindow garbage Collection
    mainWindow.on('closed',()=>{
        mainWindow = null;
    });
});

// listening for the textarea content be received
ipcMain.on('content',(e,args)=>{
    let content = args;
    let fullpath;
    let error;
    let success;
    if(filepath === undefined){
        fullpath = dialog.showSaveDialogSync(mainWindow,{defaultPath:'filename.txt'});
        filepath = fullpath;
        if(fullpath){
            writeToFile(content);
        }
    }else{
        writeToFile(content);
    }

    // if there is an error we send the ipcrenderer that file is not saved!
    // if there is no error and we send the success status


});

function writeToFile(data){
    fs.writeFile(filepath,data,err=>{
        if(err) {
            mainWindow.webContents.send("status","failure");
        }else{
            mainWindow.webContents.send("status","success");
        }
    });
}