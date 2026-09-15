// Imports
import {delLs , downloadLs , uploadLs , menuLs} from "./ls.js";
import { langCache } from "./app.js";

// Vareibles
const chartInfoBtn = document.getElementById("chartInfo");
const delData = document.getElementById("delData");
const resetMenu = document.getElementById("resetMenu");
const loadDataBtn = document.getElementById("loadData");
const about = document.getElementById("about");
// Functions
function emptyPage(){
    const page = document.createElement('div');
    const backdrop = document.createElement('div');
    const exitBtn = document.createElement("button");
    exitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="120 -840 720 720" fill="currentColor"><path d="m336-289.33 144-144 144 144L670.67-336l-144-144 144-144L624-670.67l-144 144-144-144L289.33-624l144 144-144 144L336-289.33ZM186.67-120q-27 0-46.84-19.83Q120-159.67 120-186.67v-586.66q0-27 19.83-46.84Q159.67-840 186.67-840h586.66q27 0 46.84 19.83Q840-800.33 840-773.33v586.66q0 27-19.83 46.84Q800.33-120 773.33-120H186.67Zm0-66.67h586.66v-586.66H186.67v586.66Zm0-586.66v586.66-586.66Z"/></svg>`
    exitBtn.className = "exit";
    page.className = "page";
    backdrop.className = "backdrop";
    page.append(exitBtn);
    backdrop.append(page);
    document.body.append(backdrop);
    // Event
    exitBtn.addEventListener("click" , ()=> backdrop.remove() )
    return page
};

function elementMaker(btnNum){
    const div = document.createElement("div");
    const p = document.createElement("p");
    div.append(p);
    let buttons = {};
    for(let num = 0; num < btnNum; num++){
        buttons[`btn${num+1}`] = document.createElement("button");
        div.append(buttons[`btn${num+1}`])
    };
    return div;
};

async function chartInformation(){
    const {dialogs , htmlElements} = await langCache();
    const page = emptyPage();
    const paragraph = document.createElement('div');
    paragraph.className = "paragraph";
    paragraph.innerHTML = `
    <h2>${dialogs.type1}</h2>
    <p>${dialogs.type1Des}</p><br>
    <p>${htmlElements.header1} - ${htmlElements.header2}</p>
    <h2>${dialogs.type2}</h2>
    <p>${dialogs.type2Des}</p><br>
    <p>${htmlElements.header1} - ${htmlElements.header2} - ${htmlElements.purchased}</p> 
    <h2>${dialogs.type3}</h2>
    <p>${dialogs.type3Des}</p><br>
    <p>${htmlElements.header1} - ${htmlElements.header2} ± ${htmlElements.paid} ∓ ${htmlElements.earned}</p>
    <h2>${dialogs.type4}</h2>
    <p>${dialogs.type4Des}</p><br>
    <p>${htmlElements.header1}  - ${htmlElements.header2} - ${htmlElements.purchased} ± ${htmlElements.paid} ∓ ${htmlElements.earned}</p>
    `;
    page.append(paragraph);
};

async function devAbout(){
    const {dialogs} = await langCache();
    const page = emptyPage();
    const div = document.createElement("div");
        div.className = "oneColDisplay devCol";
    const profile = document.createElement("img");
        profile.src = "images/devProfile.jpg";
        profile.className = "profile";
    const text = document.createElement("div");
        text.className = "devText";
    const name = document.createElement("p");
        name.textContent = dialogs.devName;
        name.className = "devName";
    const info = document.createElement("p");
        info.innerHTML = dialogs.devInfo;
        info.className = "devInfo";
    const contact = elementMaker(3);
        contact.className = "contact";
    contact.children[0].textContent = dialogs.contact;
    contact.children[1].textContent = dialogs.email;
    contact.children[2].textContent = dialogs.github;
    contact.children[3].textContent = dialogs.tel;
    
    text.append(name , info);
    div.append(profile , text, contact);
    page.append(div);

    //Events
    contact.children[1].addEventListener("click", ()=>{window.location.href="mailto:amirhosseinwebdeveloper@gmail.com"});
    contact.children[2].addEventListener("click", ()=>{window.location.href="https://github.com/MrWebDeveloper"});
    contact.children[3].addEventListener("click", ()=>{window.location.href="https://t.me/amir_deve"});
        
};

async function deleteDataOptions(){
    const {dialogs} = await langCache();
    const page = emptyPage();
    const div = elementMaker(5);
    div.className = "twoColDisplay";
    div.children[0].textContent = dialogs.del1;
    div.children[1].textContent = dialogs.income;
    div.children[2].textContent = dialogs.expenses;
    div.children[3].textContent = dialogs.toBuy;
    div.children[4].textContent = dialogs.dc;
    div.children[5].textContent = dialogs.all;
    div.children[0].className = "cacheText";
    div.children[5].className = "allDataDel";
    page.append(div);
    // Event
    div.children[1].addEventListener("click" , ()=>{confirmDeleteData("income" , dialogs); page.parentElement.remove();});
    div.children[2].addEventListener("click" , ()=>{confirmDeleteData("expenses" , dialogs); page.parentElement.remove();});
    div.children[3].addEventListener("click" , ()=>{confirmDeleteData("toBuy" , dialogs); page.parentElement.remove();});
    div.children[4].addEventListener("click" , ()=>{confirmDeleteData("dc" , dialogs); page.parentElement.remove();});
    div.children[5].addEventListener("click" , ()=>{confirmDeleteData("all" , dialogs); page.parentElement.remove();});
};

function confirmDeleteData(dataName , dialogs){
    const page = emptyPage();
    const div = elementMaker(2);
    div.children[0].textContent = `${dialogs.confirmDel[0]} ${dialogs[dataName]} ${dialogs.confirmDel[1]}`;
    div.children[1].textContent = dialogs.can;
    div.children[2].textContent = dialogs.con;
    div.children[1].className = "cancelBtn";
    div.children[2].className = "deleteBtn";
    div.children[0].className = "cacheText";
    div.className = "twoColDisplay";
    page.append(div);
    // Events
    div.children[1].addEventListener("click" , ()=>{page.parentElement.remove(); deleteDataOptions()});
    div.children[2].addEventListener("click" , ()=> {page.parentElement.remove(); delLs(dataName)});
};

async function confirmResetMenu(){
    const {dialogs} = await langCache();
    const page = emptyPage();
    const div = elementMaker(2);
    div.children[0].textContent = dialogs.resetAlert;
    div.children[1].textContent = dialogs.can;
    div.children[2].textContent = dialogs.reset;
    div.children[1].className = "cancelBtn";
    div.children[2].className = "deleteBtn";
    div.children[0].className = "cacheText";
    div.className = "twoColDisplay";
    page.append(div);
    // Events
    div.children[1].addEventListener("click" , ()=> page.parentElement.remove())
    div.children[2].addEventListener("click" , ()=>{page.parentElement.remove(); delLs("reset menu")})
};

const loadData = {
    dialogs: async ()=>{
        const {dialogs} = await langCache();
        return dialogs
    },

    downloadUpload: async ()=>{
        const dialogs = await loadData.dialogs();
        const page = emptyPage();
        const div = elementMaker(2);
        div.children[0].textContent = dialogs.load;
        div.children[1].textContent = dialogs.download1;
        div.children[2].textContent = dialogs.upload1;
        div.children[0].className = "cacheText";
        div.className = "oneColDisplay";
        page.append(div);
        // Events
        div.children[1].addEventListener("click" , ()=>{page.parentElement.remove(); loadData.download(dialogs);});
        div.children[2].addEventListener("click" , ()=>{page.parentElement.remove(); loadData.upload(dialogs);});
    },

    download: dialogs => {
        const page = emptyPage();
        const div = elementMaker(2);
        div.children[0].textContent = dialogs.download2;
        div.children[1].textContent = dialogs.download3;
        div.children[2].textContent = dialogs.can;
        div.children[0].className = "cacheText";
        div.children[1].className = "confirmBtn";
        div.children[2].className = "cancelBtn";
        div.className = "oneColDisplay";
        page.append(div);
        // Events
        div.children[1].addEventListener("click" , ()=>{page.parentElement.remove(); downloadLs().click();});
        div.children[2].addEventListener("click" , ()=>{page.parentElement.remove(); loadData.downloadUpload();});
    },

    upload: dialogs => {
        const page = emptyPage();
        const div = elementMaker(3);
        div.children[0].textContent = dialogs.upload2;
        div.children[1].textContent = dialogs.upReplace;
        div.children[2].textContent = dialogs.upMerg;
        div.children[3].textContent = dialogs.can;
        div.children[0].className = "cacheText";
        div.children[3].className = "cancelBtn";
        div.className = "oneColDisplay";
        page.append(div);
        // Events
        div.children[1].addEventListener("click" , ()=>{page.parentElement.remove(); loadData.getFile("replace" , dialogs);});
        div.children[2].addEventListener("click" , ()=>{page.parentElement.remove(); loadData.getFile("merge" , dialogs);});
        div.children[3].addEventListener("click" , ()=>{page.parentElement.remove(); loadData.downloadUpload();});
    },

    getFile: (Method , dialogs) => {
        const page = emptyPage();
        const div = elementMaker(0);
        const inputDiv = document.createElement("div");
        inputDiv.className = "fileInputDiv";
        inputDiv.innerHTML = `
        <input type="file" id="fileInput" style="display: none;" accept=".json , application/json">
        <label for="fileInput" class="fileInputLabel">
            <span class="fileInputBtn">${dialogs.file2}</span>
            <span class="fileInputName">${dialogs.file3}</span>
        </label>
        `
        // 
        div.children[0].textContent = dialogs.file1;
        div.children[0].className = "cacheText";
        div.className = "oneColDisplay";
        div.append(inputDiv);
        page.append(div);
        // Events
        inputDiv.children[0].addEventListener("change" , async (e)=>{
            if(e.target.files[0].name.endsWith(".json")){
                // جلوگیری از ساخت دکمه ادامه تکراری
                if(div.children[2]){div.children[2].remove()};

                inputDiv.children[1].children[1].textContent =  e.target.files[0].name;
                inputDiv.children[1].children[1].style.color = "";

                const reader = new FileReader();
                reader.readAsText(e.target.files[0]);
                reader.addEventListener("load", (event)=>{
                    const res = event.target.result;
                    // check json file
                    const file = JSON.parse(res);
                    if(file.income && file.expenses && file.shoppingList && file.debtsCredits){
                        letContinue(res);
                    }else{
                        const alert = document.createElement("p");
                        alert.textContent = dialogs.invalidFileAlert;
                        alert.className = "alertText";
                        div.append(alert);
                    }
                });
                
                const letContinue = (res) => {
                    const continueBtn = document.createElement("button");
                    continueBtn.textContent = dialogs.continue;
                    div.append(continueBtn);
                    continueBtn.addEventListener("click" , ()=>{page.parentElement.remove(); loadData.confirmUpload(Method , res , dialogs)})
                }
                
                
                
            }else {
                inputDiv.children[1].children[1].textContent = dialogs.fileTypeAlert;
                inputDiv.children[1].children[1].className = "alertText";
            }
        });
    },

    confirmUpload: (Method , res , dialogs) => {
        const page = emptyPage();
        const div = elementMaker(2);
        switch(Method){
            case "replace": 
                div.children[0].textContent = dialogs.replaceAlert;
                div.children[2].textContent = dialogs.replace;
                break;
            case "merge":
                div.children[0].textContent = dialogs.mergAlert;
                div.children[2].textContent = dialogs.merg;
                break;
        };
        div.children[1].textContent = dialogs.can;
        div.children[1].className = "cancelBtn";
        div.children[2].className = "confirmBtn";
        div.children[0].className = "cacheText";
        div.className = "twoColDisplay";
        page.append(div);
        // Event
        div.children[1].addEventListener("click" , ()=>{page.parentElement.remove(); loadData.upload(dialogs);});
        div.children[2].addEventListener("click" , ()=>{page.parentElement.remove(); uploadLs(Method , res);});
    }
};


// Event
chartInfoBtn.addEventListener("click" , chartInformation);
about.addEventListener("click" , devAbout);
delData.addEventListener("click" , deleteDataOptions);
resetMenu.addEventListener("click" , confirmResetMenu);
loadDataBtn.addEventListener("click" , loadData.downloadUpload);
