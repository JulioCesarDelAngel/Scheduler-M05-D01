var localData = [];
var startTime = "08:00";

var currentDay = document.getElementById("currentDay");
var containerPage = document.getElementById("container");


function messageBox(message){
    var divmessagebox = document.getElementById("snackbar");
    divmessagebox.textContent =message;
    divmessagebox.className = "show";
    setTimeout( function () {divmessagebox.className = divmessagebox.className.replace("show","");}, 2000
  
    );
    return;
  }


function removeElement(elemento){
    while ( (elemento.firstChild != null) && elemento.firstChild){
        elemento.removeChild(elemento.firstChild);
    }

    return;
}


function dataCrud(actionType, id, description){

    if (actionType === 'R'){ 
        var getLocalStorage = JSON.parse(localStorage.getItem("SchedulerDay"));
        if (getLocalStorage !== null){
            localData = getLocalStorage;
        }
        else{
             
            if (localData.length===0){
                for (i=0; i < 10; i++){
                    
                    var newTime     = moment(startTime,"hh:mm:ss").add(60,"minutes").format("HH:mm");
                    var newTimeText = moment(startTime,"hh:mm:ss").add(60,"minutes").format("hh:mm a");
                    var newObj      = moment(newTimeText,"hh:mm a");

                    localData.push({timeId:newTime, timeText: newTimeText, taskText:"", timeEl:newObj});

                    startTime = newTime
                }
                localStorage.setItem("SchedulerDay",JSON.stringify(localData));
            }
        }
    }
    else if (actionType==="U"){
        if (id>=0){
            localData[id].taskText=description;
            localStorage.setItem("SchedulerDay",JSON.stringify(localData));
        }
    }
}



function listTask(){

    removeElement(containerPage);
    
    var dateNow = new Date();
    var hourNow = dateNow.getHours();
    var backRow = "";

    for (i=0; i<localData.length; i++){

        if (moment(localData[i].timeEl).hours() < hourNow ){
            backRow = "description past";
        }
        else if (moment(localData[i].timeEl).hours() > hourNow ) {
            backRow = "description  future";
        }
        else{
            backRow = "description  present";
        }

        var divRow = document.createElement("div");
        divRow.setAttribute("class", "row");
      
        var labelRow = document.createElement("label");
        labelRow.setAttribute("class", "hour");
        labelRow.textContent = localData[i].timeText;

        var inputRow = document.createElement("input");
        inputRow.id = "index-row"+i;
        inputRow.setAttribute("class", backRow);
        inputRow.setAttribute("type","text");
        inputRow.value  = localData[i].taskText;

        var btnRow = document.createElement("button");
        btnRow.setAttribute("class", "saveBtn");
        btnRow.setAttribute("data-index",i)

        var iconRow = document.createElement("i");
        iconRow.setAttribute("class", "fa fa-save");
        iconRow.setAttribute("data-index",i)

        btnRow.appendChild(iconRow);

        divRow.appendChild(labelRow);
        divRow.appendChild(inputRow);
        divRow.appendChild(btnRow);

        containerPage.appendChild(divRow);
    
    }

    return;
}

containerPage.addEventListener("click", function(event){
    
    var element = event.target;
    if ((element.matches("button") === true) || (element.matches("i") )){
        var index = element.getAttribute("data-index");        

        var dataRow = document.getElementById("index-row"+index);
        if  (dataRow != null){
            dataCrud("U", index, dataRow.value);
            dataCrud("R");
            listTask();
            messageBox("Elemento guardado.");
        }
        
    }
});

function init(){
    currentDay.textContent = moment().format("ddd,MMM Do YYYY");   
    
    dataCrud("R");
    listTask();
};

init();
