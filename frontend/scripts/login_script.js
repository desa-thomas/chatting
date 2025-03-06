/**
 * Author: Thomas De Sa
 *
 * Script for handling login page
 */

/**
 * Initialize variables on page load
 */
onload = function () {
  document.getElementById("username").value = "";
  
  /**Enter Key listeners */
  document.getElementById("username").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      validateform();
    }
  });
  document.getElementById("password").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      validateform();
    }
  });
  document.getElementById("submit").onclick = validateform;

  /**Login and Create Account buttons*/
  document.getElementById("login-button").onclick    = () => {select_button("login")} 
  document.getElementById("register-button").onclick = () => {select_button("register")} 
};

/**
 * Function for submit button to submit login form
 */
function validateform() {
  username_field = document.getElementById("username");
  username = username_field.value;
  password = document.getElementById("password").value;

  if (username.trim() == "" || password.trim() == "") {
    shake();
    return;
  }

  let login = false;
  /**
   * check username and password on server
   */

  if (!login) {
    shake();
    //return
  }

  /**
   * Set sesion variable to unique key sent by server to keep user logged in
   * sessionStorage.setItem("key", key )
   * */
  sessionStorage.setItem("username", username)
  /**
   * redirect user
   * location.href="index.html"
   */

  location.href = "../../index.html";
}

/**
 * Trigger shake animation on login field if incorrect login credentials are inputted
 */
function shake() {
  username_field = document.getElementById("username");
  username_field.classList.add("shakeclass");
  username_field.offsetWidth;
  username_field.focus();

    /**remove animation when it finishes */
  setTimeout(()=>{
    username_field.classList.remove("shakeclass")
  }, 200)
}


/**
 * Select button (Log in & Create Account) handler
 */
function select_button(id){
  document.getElementById("select-buttons").hidden = true 
  document.getElementById(id).hidden = false
}