import {showData , menuLs} from "./ls.js";
import { showBalance } from "./chart.js";

// *** variables ***
const menuIcon = document.getElementById('menuIcon');
const closeMenuBtn = document.getElementById('closeMenu');
const menu = document.getElementById('menu');
const chartCenter = document.getElementById('chartCenter')
const calendarP = document.getElementById('calendar');
const addBtn = document.getElementById('addBtn');
const visibility = document.getElementById('visibility');
let visi = false;
const main = document.getElementById('everyThing');
const headers = document.getElementById('contentHeaders')
const income = document.getElementById('income');
const expenses = document.getElementById('expenses');
const toBuy = document.getElementById('shoppingList');
const deb_cre = document.getElementById('debtsCredits');
const ul = document.getElementById('UL');
let adding = "income";
let langPromise;
let widthCache = innerWidth;
// *** Functions ***

async function langCache() {
    if(!langPromise){
        langPromise = (async ()=>{
            const file = await fetch("./lang.json");
            const res = await file.json();
            return res;
        })();
    };
    const res = await langPromise;
    return res[menuLs.getUserChoices().language]
};

async function translator(){
    const el = document.querySelectorAll('[data-lang]');
    const {htmlElements} = await langCache();
    el.forEach(element => {
        const key = element.getAttribute("data-lang");
        element.innerHTML = htmlElements[key]
    });
};

function direction(){
    if(JSON.parse(localStorage.getItem("userChoices"))?.textDirection === "2"){
        document.documentElement.style.setProperty('--direction', 'ltr');
        
    }else{
        document.documentElement.style.setProperty('--direction', 'rtl');
        
    }
};

function changeFont(){
    const font = Number(JSON.parse(localStorage.getItem("userChoices"))?.font);
    let newFont;
    switch(font){
        case 1:
            newFont = "Arial, Helvetica, sans-serif";
            document.body.className = "";
            break;
        case 2:
            newFont = "amiriItalic";
            document.body.className = "font-amiriItalic";
            break;
        case 3:
            newFont = "reemKufi";
            document.body.className = "font-reemKufi";
            break;
        case 4:
            newFont = "nastaliqUrdu";
            document.body.className = "font-nastaliqUrdu";
            break;
        case 5:
            newFont = "rakkas";
            document.body.className = "font-rakkas";
            break;
        case 6:
            newFont = "charm";
            document.body.className = "font-charm";
            break;
        case 7:
            newFont = "robotoSerifItalic";
            document.body.className = "font-robotoSerifItalic";
            break;
        case 8:
            newFont = "inconsolata";
            document.body.className = "font-inconsolata";
            break;

    };
    document.documentElement.style.setProperty('--font', newFont);
};

function changeHeader(e){
    // جلوگیری از ایجاد هدر تکراری
    if(adding === e?.target.id){return};
    //first reset styles
    headers.children[0].classList.remove("selectedHeader");
    headers.children[1].classList.remove("selectedHeader");
    headers.children[2].classList.remove("selectedHeader");
    headers.children[3].classList.remove("selectedHeader");
    headers.children[0].classList.add("unselectedHeader");
    headers.children[1].classList.add("unselectedHeader");
    headers.children[2].classList.add("unselectedHeader");
    headers.children[3].classList.add("unselectedHeader");
    try{    
        // changing selected heder style
        adding = e.target.id;
        e.target.classList.add("selectedHeader");
        e.target.classList.remove("unselectedHeader");
        showData(adding);
    }catch{
        adding = "income";
        income.classList.add("selectedHeader");
        income.classList.remove("unselectedHeader");
        showData("income");
    }
};

function calendar(){
    let format;
    let locale;
    menuLs.getUserChoices().dateFormat === "1" ?
    (format = "jYYYY/jMM/jDD" , locale = "fa"):
    (format = "YYYY/MM/DD" , locale = "en");
    calendarP.textContent = `${moment(new Date().getTime()).format(format)} | ${moment(new Date().getTime()).locale(locale).format("dddd")}`;
}


const menuAnimation = new IntersectionObserver(el => {
    menu.className = "menu";
});

menuAnimation.observe(menu);
// *** Events ***

// ********** Open and Close Menu **********
menuIcon.addEventListener("click" , ()=> {
    menu.style.display = "grid";
    menuIcon.style.display = "none";
});
closeMenuBtn.addEventListener("click" , ()=>{
    menu.style.display = "none";
    menuIcon.style.display = "block";
});
window.addEventListener("resize" , ()=>{
    if(innerWidth === widthCache){return}; // just width resize run fallowing codes!
    if(innerWidth > 600){
        menuIcon.style.display = "none";
        menu.style.display = "grid";
    }else if(innerWidth < 600){
        menuIcon.style.display = "block";
        menu.style.display = "none";
    };
});
// ********** Change Headers **********
income.addEventListener("click" , changeHeader);
expenses.addEventListener("click" , changeHeader);
toBuy.addEventListener("click" , changeHeader);
deb_cre.addEventListener("click" , changeHeader);
// ********** First Load... **********
document.addEventListener("DOMContentLoaded" , ()=>{
    calendar();
    menuLs.fixMenu();
    changeHeader();
})
visibility.addEventListener("click" , ()=>{
    if(visi){
        visi = false;
        showBalance();
        showData(adding);
        visibility.innerHTML = `<path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>`;
        
    }else{
        visi = true;
        showBalance();
        showData(adding);
        visibility.innerHTML = `<path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>`;
    }

})
// *** exports ***
export {adding , visi , langCache , direction , changeFont , translator, calendar};