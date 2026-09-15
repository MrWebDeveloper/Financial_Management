import {deleteData , menuLs , editData , checkData} from "./ls.js";
import { adding , visi , langCache} from "./app.js";
import { jsColors } from "./theme.js";
const content = document.getElementById("content");
const ul = document.getElementById("UL");
let DH; // Date Holder
let sign;
let ND; //Number Display

async function noItem(){
    const {dialogs} = await langCache();
    const p = document.createElement("p");
    p.textContent = dialogs.noItem;
    p.className = "noItem";
    content.append(p);
}
async function createElements(obj , clearDH=false){
    if(clearDH){DH = ""};
    const {dialogs} = await langCache();
    // chose Number Display    
    switch(menuLs.getUserChoices().numberDisplay){
    case "1": ND = "fa"; break;
    case "2": ND = "en"; break;
    case "3": ND = "fr"; break;
    case "4": ND = "de"; break;};
    // chose current sign
    if(adding === "income"){sign = "+"}
    else if(adding === "expenses"){sign = "-"}
    else{sign = ""};
    // creating shared elements
    const li = document.createElement("li");
    li.className = "item";
    const div1 = document.createElement("div");
    div1.className = "div1";
    const div2 = document.createElement("div");
    div2.className = "div2";
    const pNum = document.createElement("p");
    if(visi){pNum.textContent = "***";}else{
        pNum.textContent = `${sign}${Number(obj.Amount).toLocaleString(ND ?? "fa")}`;
    }
    const pCur = document.createElement("p"); pCur.className = "pCur";
    pCur.textContent = `${menuLs.getUserChoices().currency}`;
    const pTxt = document.createElement("p");
    pTxt.textContent = `${obj.description}`;
    const del = document.createElement("button");
    del.textContent = dialogs.remove;
    const delText = document.createElement("p");
    delText.textContent = dialogs.holdRemove;
    delText.className = "delText";
    del.append(delText);
    const edit = document.createElement("button");
    edit.textContent = dialogs.edit;
    const hideItem = document.createElement("div");
    hideItem.className = "hideItem";
    hideItem.style.display = "none";
    del.className = "del";
    edit.className = "edit";
    hideItem.append(del , edit);
    pNum.className = `amount_${adding}`;
    div1.append(pNum , pCur);
    div2.append(pTxt);
    li.append(div1 , div2 , hideItem);

    // creating non-shared elements
    switch(adding){
        case "income":
            date(obj, dialogs);
            break;
        case "expenses":
            date(obj, dialogs);
            break;
        case "shoppingList":
            shop(obj , div1 , hideItem, dialogs);
            break;
        case "debtsCredits":
            dc(obj , li, hideItem, dialogs);
            li.classList.add("item-dc");
            break;
    };
    ul.append(li);
    //Item Events
    //LI options
    li.addEventListener("pointerdown" , ()=>{
        const holdTimer = setTimeout(()=>{
            hideItem.style.display = "flex";
            // Mobile Tip
            if (window.innerWidth <= 600) {
                delText.style.opacity = "100%";
                setTimeout(()=>delText.style.opacity = "0%" , 2000 )
            }
            } , 400);
        li.addEventListener("pointerup" , ()=> clearTimeout(holdTimer));
        li.addEventListener("pointerout" , ()=> clearTimeout(holdTimer));
        });
    // closing LI options
    hideItem.addEventListener("click", ()=> hideItem.style.display = "none");
    // Delete Button:
    del.addEventListener("pointerdown" , (e)=>{
        del.classList.add("deleting");
        const holdTimer = setTimeout(()=>{
            deleteData(obj.id);
            li.remove()} , 1300);
        // canceling the Timeout
        del.addEventListener("pointerup" , ()=> {clearTimeout(holdTimer);del.classList.remove("deleting");});
        del.addEventListener("pointerout" , ()=> {clearTimeout(holdTimer);del.classList.remove("deleting");});
        del.addEventListener("click", (e) => e.stopPropagation());
        });
    // Edit Button:
    edit.addEventListener("click" , (e)=>{
        editData(obj);
        hideItem.style.display = "none"
    });
        
    
    
};

function date(obj , dialogs){
    let format;
    let locale;
    menuLs.getUserChoices().dateFormat === "1" ?
    (format = "jYYYY/jMM/jDD" , locale = "fa"):
    (format = "YYYY/MM/DD" , locale = "en");
    if(DH !== obj.date){
        DH = obj.date;
        createHR()
    }
    function createHR(){
        const hr = document.createElement("hr");
        obj.date === 0?
        hr.append(dialogs.noDate):
        hr.append(`${moment(obj.date).format(format)} ${moment(obj.date).locale(locale).format("dddd")}`);
        ul.append(hr);
    }
};

function shop(obj , div1 , hideItem , dialogs){
    // Creating the priority mark
    const d2 = document.createElement("div"); d2.className = "priority";
    div1.append(d2);
    const color = {
        prio1: jsColors.prio1,
        prio2: jsColors.prio2,
        prio3: jsColors.prio3,
        prio4: jsColors.prio4,
        prio5: jsColors.prio5,
    };
    d2.style.backgroundColor = color[obj.priority];
    // d2.style.border = `0px solid ${color[obj.priority]}`;
    // Creating the purchased button in options
    const purchased = document.createElement("button");
    purchased.className = "purchased";
    purchased.textContent = dialogs.purchased;
    hideItem.append(purchased);
    // Style of purchased Items
    if(obj.purchased){
        div1.parentElement.classList.add("purchased_items");
        d2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="${color[obj.priority]}"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"/></svg>`;

        purchased.style.backgroundColor = jsColors.undo;
        purchased.textContent = dialogs.undo;
    };
    //Events
    purchased.addEventListener("click", ()=> checkData(obj));

};

function dc(obj , li, hideItem, dialogs){
    // Creating The DC Mark
    const dc = document.createElement('p');
    dc.className = `markOf${obj.dc}`;
    li.append(dc);
    // Creating The Earned and Paid (EP)
    const EP = document.createElement("button");
    hideItem.append(EP);
    if(obj.dc === "credit"){
        EP.className = "earned";
        EP.textContent = dialogs.earned;
        dc.textContent = dialogs.credit.toUpperCase();
    }else {
        EP.className = "paid"
        EP.textContent = dialogs.paid;
        dc.textContent = dialogs.debt.toUpperCase();
    }
    // Style of EP Items
    if(obj.position === "earned"){
        li.classList.add("earned_items");
        EP.style.backgroundColor = jsColors.undo;
        EP.textContent = dialogs.undo;
    }else if(obj.position === "paid"){
        li.classList.add("paid_items");
        EP.style.backgroundColor = jsColors.undo;
        EP.textContent = dialogs.undo;
    }
    //Events
    EP.addEventListener("click", ()=> checkData(obj));
    
    

};

export {createElements , noItem};