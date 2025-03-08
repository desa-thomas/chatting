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
      validatelogin();
    }
  });
  document.getElementById("password").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      validatelogin();
    }
  });
  document.getElementById("submit").onclick = validatelogin;

  /**Login and Create Account buttons*/
  document.getElementById("login-button").onclick = () => {
    select_button("login");
  };
  document.getElementById("register-button").onclick = () => {
    select_button("register");
  };

  objs = this.document.getElementsByClassName("backbutton");
  for (obj of objs) {
    console.log(obj)
    obj.onclick = backbutton("mouseup")
    obj.addEventListener("mousedown", (e) => {
      backbutton("mousedown");
    });
    obj.addEventListener("mouseup", (e) => {
      backbutton("mouseup");
    });
  }
  this.document.getElementById("register-submit").onclick = validateRegister;

  /**Create Account Stuff */
  for (obj of this.document.getElementById("register").children) {
    if (obj.id !== "backbutton2" && obj.id !=="register-submit") {
      obj.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          validateRegister();
        }
      });
    }
  }

  /**Remember me checkbox */
  this.document.getElementById("regi-remember-div").onclick = ()=>{
    this.document.getElementById("register-remember").checked = !this.document.getElementById("register-remember").checked 
  }
  this.document.getElementById("login-remember-div").onclick = ()=>{
    this.document.getElementById("login-remember").checked = !this.document.getElementById("login-remember").checked 
  }

  /**prevent text selection on window */
  this.window.addEventListener("selectstart", (e)=>{e.preventDefault()})
};

/**
 * Function for submit button to submit login form
 */
function validatelogin() {
  document.getElementById("error").hidden = true

  username_field = document.getElementById("username");
  username = username_field.value;
  password = document.getElementById("password").value;

  if (username.trim() == "" || password.trim() == "") {
    shake("username");
    err_msg("Fields are required")
    return
  }

  else if (containsWhitespace(username)){
    shake("username")
    err_msg("Invalid Username")
    return
  }

  /**
   * check username and password on server
   */

  //let login = false;
  if (!login) {
    shake("username");
    //return
  }

  /**Use session or local storage depending on whether the user selects 'remember me' */
  let remember_me = document.getElementById("login-remember").checked
  console.log(remember_me)
  if(!remember_me){
    sessionStorage.setItem("username", username);
    console.log(username)
  }
  else{
    localStorage.setItem("username", username)
  }

  /** redirect user*/
  location.assign("../../index.html");
}

/**
 * Validation function for when user creates an account
 */
function validateRegister() {
  document.getElementById("error").hidden = true

  username_field = document.getElementById("register-username")
  username = username_field.value
  password = document.getElementById("register-password")
  password_check = document.getElementById("check-password")

  let account_created = false

  /** Parse username and password before requesting server */
  if (username.trim() == "" || password.value.trim() == "") {
    shake("register-username");
    err_msg("All fields are required")
    return
  }

  else if(password.value != password_check.value){
    err_msg("Passwords do not match")
    shake("register-username")
    return 
  }

  else if(containsWhitespace(username) || username.includes("-")){
    shake("register-username")
    err_msg("Invalid username")
    return
  }

  /**Check if username contains a banned word */
  let contains_banned_word = false
  for (profanity of banndedwords){
    if(username.includes(profanity)){
      contains_banned_word = true
      break
    }
  }

  if (contains_banned_word){
    shake("register-username")
    err_msg("Username cannot contain banned words")
    return
  }

  else if(!checkPassword(password.value)){
    shake("register-username")
    err_msg("Password must be long than 8 characters")
    return
  }


  /**
   * Contact server,,, check if username is taken
   */

  account_created = true

  if (account_created){

    let remember_me = document.getElementById("register-remember")
    if(!remember_me){
      sessionStorage.setItem("username", username);
    }
    else{
      localStorage.setItem("username", username)
    }

    window.location.assign("../../index.html")
  }
}

/**
 * Trigger shake animation on login field if incorrect login credentials are inputted
 */
function shake(id) {
  username_field = document.getElementById(id);
  username_field.classList.add("shakeclass");
  username_field.offsetWidth;
  username_field.focus();

  /**remove animation when it finishes */
  setTimeout(() => {
    username_field.classList.remove("shakeclass");
  }, 200);
}

/**
 * Select button (Log in & Create Account) handler
 * @param {string} id - Id of button clicked
 */
function select_button(id) {
  document.getElementById("select-buttons").hidden = true;
  document.getElementById(id).hidden = false;

  if (id == "login") {
    document.getElementById("username").focus();
  } else {
    document.getElementById("register-username").focus();
  }

  /**Clear fields */
  children = document.getElementById(id).children;
  for (item of children) {
    item.value = "";
  }
}

/**
 * Function for back arrow button. Changes it's css class
 */
function backbutton(e) {
  let backarrow = document.getElementById("backarrow");

  if (e == "mousedown") {
    backarrow.classList.add("clicked");
  } else {
    backarrow.classList.remove("clicked");

    document.getElementById("error").hidden = true;
    document.getElementById("login").hidden = true;
    document.getElementById("register").hidden = true;
    document.getElementById("select-buttons").hidden = false;
  }
}

/**
 * register or login error message
 * @param {*} msg error message
 */
function err_msg(msg){
  obj = document.getElementById("error")
  obj.hidden = false
  obj.innerHTML = msg
}

/**
 * Check password to see if valid
 * @param {string} password 
 */
function checkPassword(password){
  let valid = true

  if(password.length < 8){
    valid = false
  }

  return valid
}

//contains whitespace funciton (thx 30secondsofcode)
const containsWhitespace = str => /\s/.test(str);

/**const list of banned words for usernames from bannedwordslist.com  */
const banndedwords = ["anal", "anus", "arse", "ass", "ballsack", "balls", "bastard", "bitch", "biatch", "bloody", "blowjob", "blow job", "bollock", "bollok", "boner", "boob", "bugger", "bum", "butt", "buttplug", "clitoris", "cock", "coon", "crap", "cunt", "damn", "dick", "dildo", "dyke", "fag", "feck", "fellate", "fellatio", "felching", "fuck", "f u c k", "fudgepacker", "fudge packer", "flange", "Goddamn", "God damn", "hell", "homo", "jerk", "jizz", "knobend", "knob end", "labia", "lmao", "lmfao", "muff", "nigger", "nigga", "omg", "penis", "piss", "poop", "prick", "pube", "pussy", "queer", "scrotum", "sex", "shit", "s hit", "sh1t", "slut", "smegma", "spunk", "tit", "tosser", "turd", "twat", "vagina", "wank", "whore", "wtf"]