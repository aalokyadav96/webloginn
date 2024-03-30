
var isLoggedIn = false;
let header = `<header><div class="logo">Logo Here</div><div class="formcon">Search Here</div><div class="usercon"><p id="demo"></p><p id="login">Login.</p><p id="signup">Signup.</p></div><p id="logout"></p></header>`;
let html = `${header}<main id="main"></main>`;
//
if (IsLoggedIn() == true) {
	let header = `<header><div class="logo">Logo Here</div><div class="formcon">Search Here</div><div id="demo"></div><div class="usercon"></div><p id="login"></p><p id="logout">Logout.</p></header>`;
	let tags = ["template strings", "javascript", "es6"];
	html = `${header}<ul>`;
	for (const x of tags) {
		html += `<li>${x}</li>`;
	}
	html += `</ul><div id="uzer"></div><div onclick="createBody();">Upload</div><main id="main"></main>`;
}
//

let loginPage = `<form class="login_box" method="post" action="/login"><label for="name">User name</label><br><input type="text" id="username" name="username" required><label for="password">Password</label><br><input type="password" id="password" name="password" required><br><br><div class="footer"><div class="bar_tool"><div style="width:4rem;height:4rem;background:#ccc;" id="loginsubmit">Login</div></div></div></form>`

let signupPage = `<form class="signup_box" method="post" action="/signup"><label for="name">User name</label><br><input type="text" id="username" name="username" required><br><label for="password">Password</label><br><input type="password" id="password" name="password" required><br><br><div class="footer"><div class="bar_tool"><div style="width:4rem;height:4rem;background:#ccc;" id="signupsubmit">Sign Up</div></div></div></form>`


document.getElementById("root").innerHTML = html;

document.getElementById("logout").addEventListener("click", Logout);

window.onload=function(){
	loadScript('/static/dynamic/upload.js',function(){
	console.log('done loading');});
	if (IsLoggedIn() == false) {
		document.getElementById("login").addEventListener("click", LoginFn);
		document.getElementById("signup").addEventListener("click", SignUp);
	}
}

function myFunction() {
	document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
}

function LoginFn() {
		//~ loadScript('/static/dynamic/login.js',function(){
		//~ console.log('done loading');
		document.getElementById("main").innerHTML = loginPage;
		document.getElementById("loginsubmit").addEventListener("click", apiRequestSET);
	//~ });
}

function SignUp() {
	document.getElementById("main").innerHTML = signupPage;
	document.getElementById("signupsubmit").addEventListener("click", Register);
}
	
function Register() {
	let unaem = document.getElementById('username').value;
	let psswd = document.getElementById('password').value;
	const formData = new FormData();
	formData.append("username", unaem);
	formData.append("password", psswd);
	const xhr = new XMLHttpRequest();
	var resp = "";
	xhr.open("POST", "/signup", true);
	xhr.onload = () => {
		resp = xhr.responseText;
		console.log(resp);
		if (resp == "200") {
			//~ location.reload();
			//~ window.location = "/login";
			LoginFn();
		} else {
			alert("user already exists");
		}
	};
	xhr.send(formData);
}

function apiRequestSET() {
	let unaem = document.getElementById('username').value;
	let psswd = document.getElementById('password').value;
	const formData = new FormData();
	formData.append("username", unaem);
	formData.append("password", psswd);
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/login", true);
	xhr.onload = () => {
			//~ document.getElementById("demo").innerH	TML = xhr.responseText;
			SaveToSessionStorage("webtoken",xhr.responseText)
			SaveToLocalStorage("webtoken",xhr.responseText)
			location.reload();
	};
	xhr.send(formData);
	// xhr.send('string');
	// xhr.send(new Blob());
	// xhr.send(new Int8Array());
	// xhr.send(document);
}

function SaveToSessionStorage(key,value) {
	sessionStorage.setItem(key, value);
	let personName = sessionStorage.getItem(key);
	//~ document.getElementById("demo").innerHTML = personName;
	isLoggedIn = true;
}

function IsLoggedIn() {
	if (sessionStorage.getItem("webtoken") != null) {
		return true;
	}
	return false;
}

function SaveToLocalStorage(key,value) {
	localStorage.setItem(key, value);
	let personName = localStorage.getItem(key);
	//~ document.getElementById("demo").innerHTML = personName;
}


function Logout() {
	isLoggedIn = false;
	sessionStorage.removeItem("webtoken");
	localStorage.removeItem("webtoken");
	location.reload();
	delete_cookie("exampleCookie")
	const xhr = new XMLHttpRequest();
	xhr.open("DELETE", "/logout", true);
	xhr.onload = () => {
		//~ window.location = "/wet";
//~		location.reload();
	};
	xhr.send(null);
	//~ window.location.reload();
}
function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function loadScript(filename,callback){
  var fileref=document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.onload = callback;
  fileref.setAttribute("src", filename);
  if (typeof fileref!="undefined"){
    document.getElementsByTagName("head")[0].appendChild(fileref)
  }
}

//~location.reload();

//~ var script = document.createElement('script');
//~ script.onload = function () {
    //~ createBody();
//~ };
//~ script.src = "/static/dynamic/upload.js";

//~ document.head.appendChild(script);