const socket = io()

function hex2rgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return [ r, g, b ];
}


var color_btn = document.getElementById("color_btn")
var brightness_btn = document.getElementById("brightness_btn")
var power_btn = document.getElementById("power")

//get current power
if(localStorage.getItem("power") == "off"){
    power_btn.classList.add("off")
}

//get current color
const componentToHex = (c) => {
    const hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

var current_color = JSON.parse(localStorage.getItem("color"))
if(current_color === null) current_color = {'r': 255, 'g':255, 'b': 255}

document.getElementById("color").value =  "#" + componentToHex(current_color['r']) + componentToHex(current_color['g']) + componentToHex(current_color['b']);

//get current brightness
var current_brightness = localStorage.getItem("brightness")
if(current_brightness === null) current_brightness = "100"
document.getElementById("brightness").value =  current_brightness

color_btn.onclick = function () {
    var value = document.getElementById("color").value
    // HEX TO RGB
    value = hex2rgb(value)
    var color = JSON.stringify({'r': value[0], 'g': value[1], 'b': value[2]})
    localStorage.setItem("color", color)
    socket.emit("color-change", {color: color})
}

brightness_btn.onclick = function(){
    var value = document.getElementById("brightness").value
    localStorage.setItem("brightness", value)
    socket.emit("brightness-change", {brightness: value})
}

power_btn.onclick = function(){
    if(power_btn.classList.contains("off")){
        //turn on
        power_btn.classList.remove("off")
        localStorage.setItem("power", "on")
        socket.emit("power-change", {power: "on"})
    } else {
        //turn off
        power_btn.classList.add("off")
        localStorage.setItem("power", "off")
        socket.emit("power-change", {power: "off"})
    }
    
}