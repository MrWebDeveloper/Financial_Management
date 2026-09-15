// Imports
import {getLs , menuLs} from "./ls.js";
import { visi , langCache } from "./app.js";
// Variebles
const balance = document.getElementById("balance");
const chartCenter = document.getElementById("chartCenter");
const chartLine = document.getElementById("chartLine");

// Functions
function incomeAcc(type){
    let acc;
    try{
        if(type === 3 || type === 4){
        acc = getLs.debtsCredits(
            ).filter(item => item.dc === "debt" && item.position === "undecided"
            ).map(item => Number(item.Amount)
            ).reduce((acc , Amount) => acc + Amount);
        }else{acc = 0};
    }catch{
        acc = 0;
    }
    
    return acc;
};

function expensesAcc(type){
    let acc;
    let purchased;
    let paid;

    try{
        purchased = getLs.shoppingList(
                ).filter(item => item.purchased
                ).map(item => Number(item.Amount)
                ).reduce((acc , Amount) => acc + Amount);
    }catch{
        purchased = 0;
    }try{
        paid = getLs.debtsCredits(
            ).filter(item => item.dc === "credit" && item.position === "undecided"
            ).map(item => Number(item.Amount)
            ).reduce((acc , Amount) => acc + Amount);
    }catch{
        paid = 0;
    }    
        
    switch(type){
        case 1: acc = 0; break;
        case 2: acc = purchased; break;
        case 3: acc = paid; break;
        case 4: acc = purchased+paid; break;
    }

    return [acc , purchased , paid];
};

function math(){
    const IA = incomeAcc(Number(menuLs.getUserChoices().chartType));
    const incomeResult = getLs.income(
        ).map(item=> Number(item.Amount)
        ).reduce((acc , Amount)=>acc+Amount, IA);

    const EA = expensesAcc(Number(menuLs.getUserChoices().chartType));
    const expensesResult = getLs.expenses(
        ).map(item=> Number(item.Amount)
        ).reduce((acc , Amount)=>acc+Amount, EA[0]);
    
    const perecent =  {
        income: Math.floor((incomeResult/(incomeResult+expensesResult))*100) ,
        expenses: Math.floor((expensesResult/(incomeResult+expensesResult))*100)};

    return [incomeResult , expensesResult , perecent , IA , EA]
};

function showBalance(){
    
    if(visi){
        balance.textContent = "*****";
    }else{
        const res = math();
        const bal = (res[0] - res[1]);
    
        document.documentElement.style.setProperty("--chartPerecent" , `${res[2].income}%`)
        if(bal > 0){document.documentElement.style.setProperty("--balanceColor" , "#00FF00")};
        if(bal < 0){document.documentElement.style.setProperty("--balanceColor" , "#FF0000")};
        if(bal === 0){document.documentElement.style.setProperty("--balanceColor" , "#F0F0F0")};

        let ND;  // chose Number Display 
        switch(menuLs.getUserChoices().numberDisplay){
        case "1": ND = "fa"; break;
        case "2": ND = "en"; break;
        case "3": ND = "fr"; break;
        case "4": ND = "de"; break;};
        balance.textContent = `${bal.toLocaleString(ND)} ${menuLs.getUserChoices().currency}`
        fitBalanceNumber();
    }
    
};

async function showDetail(){
    const type = Number(menuLs.getUserChoices().chartType);
    const {htmlElements} = await langCache();
    const mathResult = math();
    const emptyPage = document.createElement("div");
    const ul = document.createElement("ul"); ul.className = "chartDetail";
    const income = document.createElement("li"); income.className = "greenNumber";
    const earned = document.createElement("li"); earned.className = "redNumber";
    const expenses = document.createElement("li"); expenses.className = "redNumber";
    const purchased = document.createElement("li"); purchased.className = "redNumber";
    const paid = document.createElement("li"); paid.className = "greenNumber";
    income.textContent = `${htmlElements.header1}: ${mathResult[0]-mathResult[3]}`;
    expenses.textContent = `${htmlElements.header2}: ${mathResult[1]-mathResult[4][0]}`;
    purchased.textContent = `${htmlElements.purchased}: ${mathResult[4][1]}`;
    earned.textContent = `${htmlElements.earned}: ${mathResult[4][2]}`;
    paid.textContent = `${htmlElements.paid}: ${mathResult[3]}`;
    switch(type){
        case 1:
            ul.append(income , expenses);
            break;
        case 2:
            ul.append(income , expenses , purchased);
            break;
        case 3:
            ul.append(income , expenses , earned , paid);
            break;
        case 4:
            ul.append(income , expenses , purchased , earned , paid);
            break;
        default: 
            ul.append(income , expenses);
            break;
    };
    emptyPage.className = "detailPage";
    emptyPage.append(ul);
    chartLine.append(emptyPage);
    // Events
    emptyPage.addEventListener("click" , ()=>emptyPage.remove());
};

function fitBalanceNumber(){
    if(balance.scrollWidth > (chartCenter.offsetWidth * 0.9) && parseFloat(balance.style.fontSize) > 0.6){
        balance.style.fontSize = `${parseFloat(balance.style.fontSize) - 0.1}em`;
        fitBalanceNumber();
    }else if(balance.scrollWidth < (chartCenter.offsetWidth * 0.9) && parseFloat(balance.style.fontSize) < 1.4){
        balance.style.fontSize = `${parseFloat(balance.style.fontSize) + 0.1}em`;
        if(balance.scrollWidth > (chartCenter.offsetWidth * 0.9)){
            balance.style.fontSize = `${parseFloat(balance.style.fontSize) - 0.1}em`;
        }else{
            fitBalanceNumber();
        };
    };
};

// Events
document.addEventListener("DOMContentLoaded" , showBalance);
chartCenter.addEventListener("click" , showDetail);


// Exports
export {showBalance};
