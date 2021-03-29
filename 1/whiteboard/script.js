let user = ""
let socket = io();
const loginUser = () =>{
    user = document.getElementById("username").value
    console.log(user)


    if(user !== ""){
        socket.emit('connectionmsg',`${user} has joined the room`)

        socket.on('drawing', function(msg) {
            drawFigures(JSON.parse(msg))
        });

        socket.on('connectionmsg', function(msg) {
            consoleSuccess(msg)
        });

        document.getElementById("username").readOnly = true
        document.getElementById("submit").disabled = true
    }
}

document.getElementById("username").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        loginUser()
    }
});


const consoleSuccess = (msg) => {
    if(user !==""){
        console.log(msg)
        document.getElementById("console").innerHTML+=(`<div class="success">${msg}</div>`)
    }
}

const consoleError = (msg) => {
    console.log(msg)
    document.getElementById("console").innerHTML+=(`<div class="error">${msg}</div>`)
}

const changeFigType = (figure) =>{
    figureType=figure
    for(const elem of document.querySelectorAll("a.smallCase")){
        elem.classList.remove("selected")
    }
    if(figure==="Circle"){
        document.querySelectorAll("a.smallCase")[0].classList.add("selected")
    }else if(figure==="Square"){
        document.querySelectorAll("a.smallCase")[1].classList.add("selected")
    }else if(figure==="Triangle"){
        document.querySelectorAll("a.smallCase")[2].classList.add("selected")
    }else{
        document.querySelectorAll("a.smallCase")[3].classList.add("selected")
    }
}

const SetFigSize = (size) =>{
    figSize = parseInt(size)
    document.getElementById("figuresize").innerText = figSize.toString()
}

const SetBorderSize = (size) =>{
    borderSize = parseInt(size)
    document.getElementById("bdsize").innerText = borderSize.toString()
}

let figureType = 'Square'

let figSize = ""
let borderSize = ""

let bgColor = "#CACF85"
let bdColor = "#CACF85"

changeFigType('Square')
SetFigSize('40')
SetBorderSize('4')


document.getElementById("bd").addEventListener("change",(ev) => {
    bdColor = ev.target.value
})

document.getElementById("bg").addEventListener("change",(ev) => {
    bgColor = ev.target.value
})

let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
let isDrawing = false
let x = 0
let y = 0


addEventListener('load', () => {
    canvas.width = document.getElementById("leftPanel").clientWidth
    canvas.height = document.getElementById("leftPanel").clientHeight
})

addEventListener('resize', () => {
    canvas.width = document.getElementById("leftPanel").clientWidth
    canvas.height = document.getElementById("leftPanel").clientHeight
})


canvas.addEventListener('mousedown', function(e) {
    if(user !==""){
        const rect = canvas.getBoundingClientRect()
        x = e.clientX - rect.left
        y = e.clientY - rect.top
        isDrawing=true
        const params = {"x1":x, "y1":y, "bdSize":borderSize,"bdColor":bdColor, "bgColor":bgColor, "figSize":figSize, "figType":figureType, "user":user}
        if(figureType === "Square"){
            drawSquare(params)
            socket.emit("drawing",JSON.stringify(params))
        }else if(figureType === "Circle"){
            drawCircle(params)
            socket.emit("drawing", JSON.stringify(params))
        }else if(figureType === "Triangle"){
            drawTriangle(params)
            socket.emit("drawing", JSON.stringify(params))
        }

    }
    if(user == ""){
        consoleError("You must be connected to draw")
    }
})

canvas.addEventListener('mousemove', e => {
    if (isDrawing === true && figureType ==="Line" && user !== "") {
        //drawCircleAtCursor(x,y,canvas, e)
        const params = {"x1":x, "y1":y, "x2":e.offsetX, "y2":e.offsetY,"bdSize":borderSize,"bdColor":bdColor, "figType":figureType}
        drawLine(params);
        socket.emit("drawing", JSON.stringify(params))
        x = e.offsetX;
        y = e.offsetY;
    }
});

window.addEventListener('mouseup', e => {
    if (isDrawing === true && figureType ==="Line" && user !== "") {
        //drawCircleAtCursor(x,y,canvas, e)
        const params = {"x1":x, "y1":y, "x2":e.offsetX, "y2":e.offsetY,"bdSize":borderSize,"bdColor":bdColor,"figType":figureType}
        drawLine(params);
        x = 0;
        y = 0;
    }
    isDrawing = false;
});

function drawLine(params) {
    // using a line between actual point and the last one solves the problem
    c.beginPath();
    c.strokeStyle = params.bdColor;
    c.lineWidth = Math.min(params.bdSize,6);
    c.moveTo(params.x1, params.y1);
    c.lineTo(params.x2, params.y2);
    c.stroke();
    c.closePath();
}

function drawSquare(params){
    c.beginPath();
    c.strokeStyle = params.bdColor;
    c.lineWidth = params.bdSize;
    c.fillStyle = params.bgColor;
    c.rect(params.x1-(params.figSize/2),params.y1-(params.figSize/2),params.figSize,params.figSize)
    c.stroke();
    c.fill();
    c.closePath();
}

function drawCircle(params){
    c.beginPath();
    c.strokeStyle = params.bdColor;
    c.lineWidth = params.bdSize;
    c.fillStyle = params.bgColor;
    c.arc(params.x1,params.y1,params.figSize/2,0, Math.PI*2)
    c.stroke();
    c.fill();
    c.closePath();
}

function drawTriangle(params){
    c.beginPath();
    c.strokeStyle = params.bdColor;
    c.lineWidth = params.bdSize;
    c.fillStyle = params.bgColor;
    c.beginPath()
    c.moveTo(params.x1-(params.figSize/2),params.y1+(params.figSize/2));
    c.lineTo(params.x1+(params.figSize/2),params.y1+(params.figSize/2));
    c.lineTo(params.x1, params.y1-(params.figSize/2));
    c.closePath();
    c.stroke();
    c.fill();
}

const drawFigures = (params) => {
    if(user !== ""){
        if (params.figType === "Triangle"){
            drawTriangle(params)
        }else if (params.figType === "Square"){
            drawSquare(params)
        }else if (params.figType === "Circle"){
            drawCircle(params)
        }else {
            drawLine(params)
        }
    }else{
        consoleError("You must be connected to draw")
    }

}

function saveLocally(){
    const uri = canvas.toDataURL('png',1.0)
    var win = window.open();
    win.document.write('<img src="' + uri  + '"/>');

}

function sendImageToServer(){
    const doc = {user:user, file:canvas.toDataURL('image/png',0.5)}
    return fetch(`/data`,{body: JSON.stringify(doc) ,method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"}}).then(result=>{
            if(result.status == 500){
                return result.json()
            }else{
                consoleSuccess("File successfully uploaded click on the browse button to see available images")
            }
    },error => {
        consoleError("An error happened"+error)
    }).then(body => {
        if(body){
            consoleError("An error happened try again later")
        }
    })
}

