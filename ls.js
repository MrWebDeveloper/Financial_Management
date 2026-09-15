// Imports
import {createElements , noItem} from "./items.js";
import {userChoices , moneyFlow} from "./content.js";
import { adding , langCache , direction , changeFont , translator, calendar} from "./app.js";
import { showBalance } from "./chart.js";
import { switchTheme } from "./theme.js";

// Variebles
const content = document.getElementById("content");
const ul = document.getElementById("UL");
const inputBar = document.querySelectorAll('.inputBar');
const lang = document.getElementById('lang');
const dateFormat = document.getElementById('dateFormat');
const textDir = document.getElementById('textDir');
const cur = document.getElementById('cur');
const chart = document.getElementById('chart_type');
const font = document.getElementById('font');
const numDisplay = document.getElementById('numDisplay');
const theme = document.getElementById('theme');

// Functions
const getLs = {
    income: ()=>{
        let incomeArray;
        const incomeString = localStorage.getItem("incomeData");
        incomeString === null? incomeArray = []: incomeArray = JSON.parse(incomeString);
        return incomeArray;
    },
    expenses: ()=>{
        let expensesArray;
        const expensesString = localStorage.getItem("expensesData");
        expensesString === null? expensesArray = []: expensesArray = JSON.parse(expensesString);
        return expensesArray;
    },
    shoppingList: ()=>{
        let shoppingListArray;
        const shoppingListString = localStorage.getItem("shoppingListData");
        shoppingListString === null? shoppingListArray = []: shoppingListArray = JSON.parse(shoppingListString);
        return shoppingListArray;
    },
    debtsCredits: ()=>{
        let debtCreditArray;
        const debtCreditString = localStorage.getItem("debtsCreditsData");
        debtCreditString === null? debtCreditArray = []: debtCreditArray = JSON.parse(debtCreditString);
        return debtCreditArray;
    }
};

const setLs = {
    income: (item)=>{
        const incomeArray = getLs.income();
        incomeArray.push(item);
        localStorage.setItem("incomeData" , JSON.stringify(incomeArray));
        showData("income");
        showBalance();
    },
    expenses: (item)=>{
        const expensesArray = getLs.expenses();
        expensesArray.push(item);
        localStorage.setItem("expensesData" , JSON.stringify(expensesArray));
        showData("expenses");
        showBalance();
    },
    shoppingList: (item)=>{
        const shoppingListArray = getLs.shoppingList();
        shoppingListArray.push(item);
        localStorage.setItem("shoppingListData" , JSON.stringify(shoppingListArray));
        showData("shoppingList");
    },
    debtsCredits: (item)=>{
        const debtCreditArray = getLs.debtsCredits();
        debtCreditArray.push(item);
        localStorage.setItem("debtsCreditsData" , JSON.stringify(debtCreditArray));
        showData("debtsCredits");
        showBalance();
    }
};

function delLs(dataName){
    
    switch(dataName){
        case "income":
            localStorage.removeItem("incomeData");
            break;
        case "expenses":
            localStorage.removeItem("expensesData");
            break;
        case "toBuy":
            localStorage.removeItem("shoppingListData");
            break;
        case "dc":
            localStorage.removeItem("debtsCreditsData");
            break;
        case "all":
            localStorage.removeItem("incomeData");
            localStorage.removeItem("expensesData");
            localStorage.removeItem("shoppingListData");
            localStorage.removeItem("debtsCreditsData");
            break;
        case "reset menu":
            localStorage.removeItem("userChoices");
            break;
    };
    window.location.reload();
};

function downloadLs(){
    const allData = {
        income: getLs.income(),
        expenses: getLs.expenses(),
        shoppingList: getLs.shoppingList(),
        debtsCredits: getLs.debtsCredits(),
    };

    const blob = new Blob([JSON.stringify(allData, null , 2)] , {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FinancialReports.json';
    return link
};

function uploadLs(Method , res){
    const headers = ["income", "expenses", "shoppingList", "debtsCredits"];
    switch(Method){
        case "replace":
            delLs("All");
            headers.map(header => {
            localStorage.setItem(`${header}Data`, JSON.stringify(JSON.parse(res)[header]));
            });
            break;
        case "merge":
            headers.map(header => {
                const dataArray = getLs[header]();
                JSON.parse(res)[header].map((item)=>{
                    let duplicate = false;
                    dataArray.map(i=>{if(i.id === item.id){duplicate = true}});
                if(!duplicate){setLs[header](item)};
                });
            });
            break;
    };
    window.location.reload();
};

function deleteData(id){
    const data = getLs[adding]();
    const newData = data.filter(item => item.id !== id);
    localStorage.setItem( `${adding}Data` , JSON.stringify(newData));
    showData(adding); //Reload The Page
    showBalance(); // Reload The Chart
};

async function editData(obj){
    const data = getLs[adding]();
    const updateData = await moneyFlow(obj);
    data.map((item , index) => {if(item.id === obj.id){data[index] = updateData;}});
    localStorage.setItem( `${adding}Data` , JSON.stringify(data));
    showData(adding); // Reload The Page
    showBalance(); // Reload The Chart
};

function checkData(obj){
    const data = getLs[adding]();
    switch(adding){
        case "shoppingList":
            obj.purchased ? obj.purchased = false : obj.purchased = true;
            break;
        case "debtsCredits":
            if(obj.dc === "credit"){
                obj.position === "undecided"? obj.position = "earned": obj.position = "undecided";
            }else{
                obj.position === "undecided"? obj.position = "paid": obj.position = "undecided";
            }
            break;
    };
    data.map((item , index) => {if(item.id === obj.id){data[index] = obj}});
    localStorage.setItem( `${adding}Data` , JSON.stringify(data));
    showData(adding); // Reload The Page
    showBalance(); // Reload The Chart
};

function showData(header){
    // - - - - remove content
    [...ul.children].forEach(item => item.remove());
    if(content.children[1]){content.children[1].remove()};

    const lastItem = getLs[header]().length-1;
    switch(header){
        case "income":
            const incomeArray = getLs.income();
            if(incomeArray.length === 0){
                noItem();
            }else{
                incomeArray.sort((a , b)=> a.date - b.date ).reverse();
                incomeArray.map((item , index) => {
                if(index === lastItem){createElements(item , true)}
                else{createElements(item)};
                });
            };
        break;
        case "expenses":
            const expensesArray = getLs.expenses();
            if(expensesArray.length === 0){
                noItem();
            }else{
                expensesArray.sort((a , b)=> a.date - b.date ).reverse();
                expensesArray.map((item , index) => {
                    if(index === lastItem){createElements(item , true)}
                    else{createElements(item)};
                });
            }   
        break;
        case "shoppingList":
            const shoppingListArray = getLs.shoppingList();
            if(shoppingListArray.length === 0){
                noItem();
            }else{
                shoppingListArray.sort((a , b)=> a.priority.at(-1) - b.priority.at(-1)).reverse();
                shoppingListArray.map(item => createElements(item) );
            }
        break;
        case "debtsCredits":
            const debtsCreditArray = getLs.debtsCredits();
            if(debtsCreditArray.length === 0){
                noItem();
            }else{
                debtsCreditArray.reverse();
                debtsCreditArray.map(item => createElements(item) );
            }
        break;
    };
};

const menuLs = {
    getUserChoices: ()=> {
        let UC; // UC = User Choices
        const haveUC = localStorage.getItem("userChoices");
        haveUC === null? UC = userChoices: UC = JSON.parse(haveUC);
        return UC;
    },

    saveBtn: async index => {
        const {dialogs} = await langCache();
        if(inputBar[index].children[1] === undefined){
            const btn = document.createElement("button");
            btn.className = "saveBtn";
            btn.textContent = dialogs.save;
            inputBar[index].append(btn);
            inputBar[index].style.width = "80%";

            btn.addEventListener("click" , ()=> {
                menuLs.saving(btn , index);
                inputBar[index].style.width = "";
            });
        };
        
    },

    saving: (btn , index) => {
        const UC = menuLs.getUserChoices(); // UC = User Choices
        UC[Object.keys(UC)[index]] = btn.parentElement.children[0].value;
        localStorage.setItem("userChoices" , JSON.stringify(UC))
        btn.remove();
        showData(adding); // Reload The Page
        showBalance(); // Reload The Chart
        if(index === 0){translator()}
        if(index === 1){calendar()}
        if(index === 2){direction()}
        if(index === 5){changeFont()}
        if(index === 7){switchTheme();}
    },

    fixMenu: () => {
        const UC = menuLs.getUserChoices(); // UC = User Choices
        // fix Language
        lang.value = UC.language;
        translator()
        // fix Date Format
        dateFormat.value = UC.dateFormat;
        // fix Text Direction
        textDir.value = UC.textDirection;
        direction();
        // fix Currency
        cur.value = UC.currency;
        // fix Chart Type
        chart.value = UC.chartType;
        // fix Font
        font.value = UC.font;
        changeFont();
        // fix Number Display
        numDisplay.value = UC.numberDisplay;
        // fix Theme
        theme.value = UC.theme;
        switchTheme();
    }
};

// Exports
export {getLs , setLs , delLs , downloadLs , uploadLs , showData , deleteData , editData , checkData , menuLs};



