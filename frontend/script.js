let input_field = document.getElementById("input"); 
let username = "user"
let socket 
const url = "localhost"
const port = 1738
let console_log = document.getElementById("console-log")
let input = document.getElementById("input")

document.getElementById("console").onclick = function(e){input_field.focus()}

// Event listener for "Enterkey" on input
input_field.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        console.log(event.target.value)

        // Add input to console log & send msg
        log_msg(`${username}>${event.target.value}`)
        socket.send(event.target.value)

        event.target.value = ""
    }
})

/**
 * Connect to TCP server
 */
function connect(){
    socket = new WebSocket(`ws://${url}:${port}`)
    log_msg("Connecting to server...")
    input.disabled = true

    socket.onerror = (e)=>{
        log_msg("Err: Something went wrong try again later")
        console_log.appendChild(document.createElement("br"))
    }

    socket.onopen = (e) =>{
        log_msg("Connected")
        console_log.appendChild(document.createElement("br"))
        input.disabled = false
    }

    socket.onmessage = (e) =>{
        log_msg(e.data)
        console_log.appendChild(document.createElement("br"))
    }

    
}

/**
 * Add message to visual console's log
 * @param {string} msg 
 */
function log_msg(msg){
    const obj = document.createElement("div")
    obj.innerHTML = msg
    console_log.appendChild(obj)
}

connect()