// *** imports ***
import {adding , langCache} from "./app.js";
import {setLs , menuLs} from "./ls.js";
import { jsColors } from "./theme.js";

// *** Variables ***
const addBtn = document.getElementById('addBtn');
const main = document.getElementById('everyThing');
const fade = document.getElementById('fadePage');
const lang = document.getElementById('lang');
const dateFormat = document.getElementById('dateFormat');
const textDir = document.getElementById('textDir');
const cur = document.getElementById('cur');
const chart = document.getElementById('chart_type');
const font = document.getElementById('font');
const numDisplay = document.getElementById('numDisplay');
const theme = document.getElementById('theme');
const userChoices = {
    language: JSON.parse(localStorage.getItem("userChoices"))?.language ?? "fa",
    dateFormat: JSON.parse(localStorage.getItem("userChoices"))?.dateFormat ?? "1",
    textDirection: JSON.parse(localStorage.getItem("userChoices"))?.textDirection ?? "1",
    currency: JSON.parse(localStorage.getItem("userChoices"))?.currency ?? "تومان",
    chartType: JSON.parse(localStorage.getItem("userChoices"))?.chartType ?? "1",
    font: JSON.parse(localStorage.getItem("userChoices"))?.font ?? "1",
    numberDisplay: JSON.parse(localStorage.getItem("userChoices"))?.numberDisplay ?? "1",
    theme: JSON.parse(localStorage.getItem("userChoices"))?.theme ?? "1",
};

// *** Functions ***
async function whichAdd(){
    switch(adding){
        case "income":
            setLs.income(await moneyFlow());
            break;
        case "expenses":
            setLs.expenses(await moneyFlow());
            break;
        case "shoppingList":
            setLs.shoppingList(await moneyFlow());
            break;
        case "debtsCredits":
            setLs.debtsCredits(await moneyFlow());
            break;
    }
};

async function moneyFlow(obj = null){
    const {dialogs} = await langCache();
    fade.style.display = "block";
    //- - - - create Elements
    const div = document.createElement('div');main.append(div);div.className = "income";
    const form = document.createElement('form'); div.append(form);

    // number input
    const numInp = document.createElement('input');
    numInp.className = "numInp";
    numInp.setAttribute("required" , "");
    numInp.setAttribute("placeholder" , dialogs.amount);
    numInp.setAttribute("inputmode" , "numeric"); 
    numInp.setAttribute("pattern" , "[0-9]*");
    numInp.setAttribute("maxLength" , "13");
    numInp.addEventListener("input", () => {
    numInp.value = numInp.value
        .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
        .replace(/[^0-9]/g, "");
    });

    // text input
    const txtInp = document.createElement('textarea');
    txtInp.className = "txtInp";
    txtInp.setAttribute("placeholder" , dialogs.des);
    txtInp.setAttribute("maxlength" , "150");
    txtInp.setAttribute("required" , "");


    const currency = document.createElement('p'); currency.className = "currency";
    const sub = document.createElement('input'); sub.className = "subInp";
    const can = document.createElement('input'); can.className = "canInp";
    form.className = "addingForm";
    currency.textContent = cur.value;
    
    numInp.setAttribute("min" , "1"); numInp.setAttribute("max" , "9999999999999999")
    sub.setAttribute("type" , "submit"); sub.setAttribute("value" , dialogs.add);
    can.setAttribute("type" , "button"); can.setAttribute("value" , dialogs.can);
    form.append(numInp , currency ,txtInp ,  sub , can);
    // just for edit
    function toEnglishNumber(str) {
    return str.toString().replace(/[۰-۹]/g, d =>
        "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
    );
    }
    if(obj){ 
        numInp.value = toEnglishNumber(obj.Amount);
        txtInp.value = obj.description;
    }
    // برای ساخت المنت های غیر مشترک فرم
    let dc;
    let position;
    let date;
    let prio;
    let purchased;
    switch(adding){
        case "income":
            date = await setDate(form , can , div , sub , obj, dialogs);
            break;
        case "expenses":
            date = await setDate(form , can , div , sub, obj, dialogs);
            break;
        case "shoppingList":
            prio = await setPriority(form , can , div , sub, obj, dialogs);
            purchased = false;
            break;
        case "debtsCredits":
            dc = await createDC(form , can , div, sub , obj, dialogs);
            position = "undecided";
            break;
    };
    //- - - - form Events
    return new Promise((resolve , reject)=>{
        can.addEventListener("click" , ()=> {div.remove(); fade.style.display = "none";});
        
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            div.remove();
            fade.style.display = "none";
            const data = {
                id: obj?.id ?? `${Date.now()}${Math.floor(Math.random()*1000)}`,
                Amount: Number(numInp.value),
                description: txtInp.value,
                dc: dc ?? null,
                position: position ?? null,
                date: date ?? null,
                priority: prio ?? null,
                purchased: purchased ?? null,
            }
            const shortData = Object.fromEntries(Object.entries(data).filter(([key , value])=> value !== null));
            resolve(shortData);
        });
    });
};

async function createDC(form , can , div , sub , obj, dialogs){
    const debtText = document.createElement('p'); debtText.className = "debtText";
    const creditText = document.createElement('p'); creditText.className = "creditText";
    const debt = document.createElement('input'); debt.className = "debt";
    const credit = document.createElement('input'); credit.className = "credit";
    debtText.textContent = dialogs.debt; creditText.textContent = dialogs.credit;
    debt.setAttribute("type" , "radio"); debt.setAttribute("name" , "dc");
    credit.setAttribute("type" , "radio"); credit.setAttribute("name" , "dc");
    debt.setAttribute("required" , ""); credit.setAttribute("required" , "");
    debtText.append(debt); creditText.append(credit);
    form.append( debtText , creditText);
    //Events
    return new Promise((resolve , reject)=>{

        if(obj){ // just for edit
            const previous_selection = document.querySelector(`.${obj.dc}`);
            previous_selection.checked = true;
            if(previous_selection === debt){
                debtText.style.backgroundColor = jsColors.debt;
            }else{
                creditText.style.backgroundColor = jsColors.credit;
            }
        };
        debtText.addEventListener("click" , ()=> {
            debt.checked = true;
            creditText.style.backgroundColor = jsColors.dcNonSelection;
            debtText.style.backgroundColor = jsColors.debt;
        });
        creditText.addEventListener("click" , ()=> {
            credit.checked = true;
            debtText.style.backgroundColor = jsColors.dcNonSelection;
            creditText.style.backgroundColor = jsColors.credit;
        });
        sub.addEventListener("click" , ()=>{
            const selected = [debt , credit].filter(item=> item.checked === true);
            resolve(selected[0].className);
        })
        // This event works as if when dc wasn't chosen, cancel button works
        can.addEventListener("click" , ()=>
            {div.remove();
            fade.style.display = "none";
        });
        
    })
    
};

async function setDate(form , can , div , sub , obj, dialogs){
    const dateInp = document.createElement("input"); dateInp.className = "dateInp";
    const toDayBtn = document.createElement("button"); toDayBtn.className = "dayBtn";
    const noDate = document.createElement("button"); noDate.className = "noDate";
    dateInp.setAttribute("required" , ""); dateInp.setAttribute("placeholder" , dialogs.date);
    toDayBtn.innerHTML = dialogs.toDay; toDayBtn.setAttribute("type", "button");
    noDate.innerHTML = dialogs.noDate; noDate.setAttribute("type", "button");
    if(obj){// just for edit
        if(obj.date === 0){
            dateInp.disabled = true;
            toDayBtn.disabled = true;
            noDate.classList.add("noDateOn");
        }else{
            menuLs.getUserChoices().dateFormat === "1" ?
            dateInp.value = moment(obj.date).format("jYYYY/jMM/jDD"):
            dateInp.value = moment(obj.date).locale("en").format("YYYY/MM/DD");
        };
    };
    form.append(dateInp , toDayBtn , noDate);

    // ✅ محدود کردن به الگوی yyyy/mm/dd (فقط اعداد و /)
    dateInp.setAttribute("pattern", "^\\d{4}/\\d{2}/\\d{2}$");
    dateInp.setAttribute("maxlength", "10"); // جلوگیری از طول بیش از حد

    // ✅ حذف فاصله‌های اضافی هنگام تایپ
    dateInp.addEventListener("input", ()=>{
        dateInp.value = dateInp.value.replace(/\s+/g, ""); // حذف فاصله‌ها
        
    });

    dateInp.addEventListener("change", ()=>{
        let num1;
        let num2;
        let validity;
        menuLs.getUserChoices().dateFormat === "1" ?
        (num1 = 1400 , num2 = 1500 , validity = dialogs.val1):
        (num1 = 2000 , num2 = 2100 , validity = dialogs.val2);
        const match = dateInp.value.match(/^(\d{4})\/\d{0,2}\/?\d{0,2}$/);
        if (match) {
            const year = Number(match[1]);
            if (year < num1 || year > num2) {
            dateInp.setCustomValidity(validity);
            } else {
            dateInp.setCustomValidity("");
            }
        } else {
            dateInp.setCustomValidity("");
        }
    })

    //Events
    return new Promise((resolve ,  reject)=>{

        toDayBtn.addEventListener("click" , ()=>{
            menuLs.getUserChoices().dateFormat === "1" ?
            dateInp.value = moment().format("jYYYY/jMM/jDD"):
            dateInp.value = moment().locale("en").format("YYYY/MM/DD");
        });

        sub.addEventListener("click" , ()=>{
            if(dateInp.disabled){
                resolve(0)
            }else{
                menuLs.getUserChoices().dateFormat === "1" ?
                resolve(moment(dateInp.value , "jYYYY/jMM/jDD").valueOf()):
                resolve(moment(dateInp.value , "YYYY/MM/DD").valueOf());
            }
        });

        noDate.addEventListener("click" , ()=>{
            if(dateInp.disabled){
                dateInp.disabled = false;
                toDayBtn.disabled = false;
                noDate.classList.remove("noDateOn")
            }else{
                dateInp.value = "";
                dateInp.disabled = true;
                toDayBtn.disabled = true;
                noDate.classList.add("noDateOn");
            }
        });

        can.addEventListener("click" , ()=>{
            div.remove();
            fade.style.display = "none";
        });
    });
};

async function setPriority(form , can , div , sub , obj, dialogs){
    const prioDiv = document.createElement("div"); prioDiv.className = "prioDiv";
    const prioTxt = document.createElement("p"); prioTxt.textContent = dialogs.prio;
    const prio1 = document.createElement("input"); prio1.className = "prio1";
    const prio2 = document.createElement("input"); prio2.className = "prio2";
    const prio3 = document.createElement("input"); prio3.className = "prio3";
    const prio4 = document.createElement("input"); prio4.className = "prio4";
    const prio5 = document.createElement("input"); prio5.className = "prio5";
    prio1.setAttribute("type" , "radio"); prio2.setAttribute("type" , "radio");
    prio3.setAttribute("type" , "radio"); prio4.setAttribute("type" , "radio");
    prio5.setAttribute("type" , "radio"); prio1.setAttribute("name" , "prio");
    prio2.setAttribute("name" , "prio"); prio3.setAttribute("name" , "prio");
    prio4.setAttribute("name" , "prio"); prio5.setAttribute("name" , "prio");
    prio1.setAttribute("required" , ""); prio2.setAttribute("required" , "");
    prio3.setAttribute("required" , ""); prio4.setAttribute("required" , "");
    prio5.setAttribute("required" , "");
    prioDiv.append(prioTxt , prio1 , prio2 , prio3 , prio4 , prio5); form.append(prioDiv);
    if(obj){document.querySelector(`.${obj.priority}`).checked = true} // just for edit

    return new Promise((resolve , reject)=>{

        sub.addEventListener("click" , ()=>{
            const selected = [
                prio1,
                prio2,
                prio3,
                prio4,
                prio5,
            ].filter(pr => pr.checked );
            resolve(selected[0].className)
        });

        can.addEventListener("click" , ()=>
            {div.remove();
            fade.style.display = "none";
        });
    });
};

// *** Events ***
addBtn.addEventListener("click" , whichAdd);

// menu events:
lang.addEventListener("input" , () => menuLs.saveBtn(0));
dateFormat.addEventListener("input" , () => menuLs.saveBtn(1));
textDir.addEventListener("input" , () => menuLs.saveBtn(2));
cur.addEventListener("input" , () => menuLs.saveBtn(3));
chart.addEventListener("input" , () => menuLs.saveBtn(4));
font.addEventListener("input" , () => menuLs.saveBtn(5));
numDisplay.addEventListener("input" , () => menuLs.saveBtn(6));
theme.addEventListener("input" , () => menuLs.saveBtn(7));

// *** exports ***
export {userChoices , moneyFlow};