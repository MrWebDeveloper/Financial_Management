import {menuLs} from "./ls.js";
const jsColors = {
        debt: "",
        credit: "",
        dcNonSelection: "",
        prio1: "",
        prio2: "",
        prio3: "",
        prio4: "",
        prio5: "",
        undo: "",
    }
function switchTheme(){
    const theme = Number(menuLs.getUserChoices().theme);
    
    switch(theme){
        case 1:
            document.documentElement.className = "default";
            
            jsColors.debt = "#f87171";
            jsColors.credit = "#4ade80";
            jsColors.dcNonSelection = "#e5e7eb";
            jsColors.prio1 = "#78909C";
            jsColors.prio2 = "#4CAF50";
            jsColors.prio3 = "#FBC02D";
            jsColors.prio4 = "#eb8100ff";
            jsColors.prio5 = "#D32F2F";
            jsColors.undo = "#9E9E9E";
            break;
        case 2:
            document.documentElement.className = "dark";

            jsColors.debt = "#F44336";
            jsColors.credit = "#4CAF50";
            jsColors.dcNonSelection = "#424242";
            jsColors.prio1 = "#78909C";
            jsColors.prio2 = "#4CAF50";
            jsColors.prio3 = "#FBC02D";
            jsColors.prio4 = "#eb8100ff";
            jsColors.prio5 = "#D32F2F";
            jsColors.undo = "#9E9E9E";
            break;
        case 3:
            document.documentElement.className = "mocha";

            jsColors.debt = "#c45c4a";
            jsColors.credit = "#6b8e4e";
            jsColors.dcNonSelection = "#eaddcf";
            jsColors.prio1 = "#a89f91";
            jsColors.prio2 = "#6b8e4e";
            jsColors.prio3 = "#c4a484";
            jsColors.prio4 = "#b87d4b";
            jsColors.prio5 = "#c45c4a";
            jsColors.undo = "#8b7355";
            break;
        case 4:
            document.documentElement.className = "cherry";

            jsColors.debt = "#c62828";
            jsColors.credit = "#2e7d32";
            jsColors.dcNonSelection = "#e5e2e5";
            jsColors.prio1 = "#a8a4a7";
            jsColors.prio2 = "#2e7d32";
            jsColors.prio3 = "#ef6c00";
            jsColors.prio4 = "#c45c4a";
            jsColors.prio5 = "#c62828";
            jsColors.undo = "#8a8588";
            break;
        case 5:
            document.documentElement.className = "peacock";

            jsColors.debt = "#a14b3a";
            jsColors.credit = "#5f6d4c";
            jsColors.dcNonSelection = "#e0d2bc";
            jsColors.prio1 = "#a89f91";
            jsColors.prio2 = "#5f6d4c";
            jsColors.prio3 = "#c4a484";
            jsColors.prio4 = "#8b5e3c";
            jsColors.prio5 = "#a14b3a";
            jsColors.undo = "#8a7e6b";
            break;
    }
    
}
export {switchTheme , jsColors};