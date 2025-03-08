/**
 * Author: Thomas De Sa
 * Main script for chatting application. Ran on index.html
 */
const url = "localhost";
const port = 1738;
let socket;
let username

/**If user is not logged in, send them to login page */

if (sessionStorage.length == 0 && localStorage.length == 0){
  location.href = "frontend/pages/login.html"
}
else{
  username = sessionStorage.getItem("username")

  if (!username){
    username = localStorage.getItem("username")
  }

}

/*When page is loaded -> initialize variables */
onload = function () {
  let input_field = document.getElementById("input");
  input_field.value = "";
  input_field.focus();

  this.document.getElementById("username").innerHTML = `${username}>`
  this.document.getElementById("header-username").innerHTML = username

  document.getElementById("console").onclick = function (e) {
    input_field.focus();
  };

  this.document.getElementById("logout").onclick = logout

  // Event listener for "Enterkey" on input
  input_field.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      msg = event.target.value;

      if (msg != "") {
        // Add input to console log & send msg
        log_msg(`${username}>${msg}`);

        /*Send message to server*/
      }
      event.target.value = "";
    }
  });
};

/*Functions*/

/**
   * Connect to TCP server and set up websocket
   */
function connect() {
  socket = new WebSocket(`ws://${url}:${port}`);
  log_msg("Connecting to server...");
  input_field.disabled = true;

  socket.onerror = (e) => {
    console_log.appendChild(document.createElement("br"));
    log_msg("Err: Something went wrong try again later");
    input_field.disabled = true; //don't allow messages to server
  };

  socket.onopen = (e) => {
    log_msg("Connected");
    console_log.appendChild(document.createElement("br"));
    input_field.disabled = false;
  };

  socket.onmessage = (e) => {
    console_log.appendChild(document.createElement("br"));

    //parse message
    msg_obj = JSON.parse(e.data);

    if (msg_obj.type == "password") {
      input_field.type = "password";
    } else {
      input_field.type = "text";
    }

    log_msg(msg_obj.data);
    input_field.disabled = false;
    input_field.focus();
  };
}

/**
 * Add message to visual console's log
 * @param {string} msg
 */
function log_msg(msg) {
  let console_log = document.getElementById("console-log");
  const obj = document.createElement("div");
  obj.innerHTML = msg;
  console_log.appendChild(obj);
}

/**
 * send message to server
 */
function sendmessage() {}


/**
 * Logout button function
 */

function logout(){
  /**clear session & local storage */
  for (key of Object.keys(sessionStorage)){
    sessionStorage.removeItem(key)
  }
  for(key of Object.keys(localStorage)){
    localStorage.removeItem(key)
  }

  location.href = "frontend/pages/login.html"
}