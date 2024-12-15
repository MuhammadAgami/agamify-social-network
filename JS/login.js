// this function pointer to login page
function loginPage() {
  let usernameLogin = document.getElementById("usernameLogin");
  let passwordLogin = document.getElementById("passwordLogin");

  if (usernameLogin.value === "" || passwordLogin.value === "") {
    usernameLogin.setAttribute("placeholder", "من فضلك ادخل اسم المستخدم");
    passwordLogin.setAttribute("placeholder", "من فضلك ادخل كلمة السر");
    usernameLogin.classList.add("red-placeholder");
    passwordLogin.classList.add("red-placeholder");
  } else {
    axios
      .post("https://tarmeezacademy.com/api/v1/login", {
        username: usernameLogin.value,
        password: passwordLogin.value,
      })
      .then(function (response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("password", passwordLogin.value);
        window.location = `HTML/home.html`;
      })
      .catch(function (error) {
        document.getElementById("wrongUserNameOrPassword").innerHTML =
          "اسم المستخدم او كلمة السر خطأ";
      });
  }
}

// *****************************************************************

// check username and password from localStorage
if (localStorage.token) {
  usernameLogin.value = JSON.parse(localStorage.user).username;
  passwordLogin.value = localStorage.password;
}

// *****************************************************************

// create function register a new user name

function registerPage() {
  let registerName = document.getElementById("registerName");
  let registerUsername = document.getElementById("registerUsername");
  let registerPassword = document.getElementById("registerPassword");
  let registerImage = document.getElementById("registerImage");

  registerName.classList.remove("red-placeholder");
  registerUsername.classList.remove("red-placeholder");
  registerPassword.classList.remove("red-placeholder");

  if (
    !registerUsername.value ||
    !registerName.value ||
    !registerPassword.value
  ) {
    if (!registerName.value) {
      registerName.setAttribute("placeholder", "من فضلك ادخل الاسم");
      registerName.classList.add("red-placeholder");
    }
    if (!registerUsername.value) {
      registerUsername.setAttribute("placeholder", "من فضلك ادخل اسم المستخدم");
      registerUsername.classList.add("red-placeholder");
    }
    if (!registerPassword.value) {
      registerPassword.setAttribute("placeholder", "من فضلك ادخل كلمة السر");
      registerPassword.classList.add("red-placeholder");
    }
  } else {
    let formData = new FormData();
    formData.append("username", registerUsername.value);
    formData.append("password", registerPassword.value);
    formData.append("name", registerName.value);
    formData.append("image", registerImage.files[0]);

    axios
      .post("https://tarmeezacademy.com/api/v1/register", formData)
      .then(function (response) {
        console.log(response);
        alert("تم التسجيل بنجاح!");
        registerUsername.classList.remove("red-placeholder");
        registerPassword.classList.remove("red-placeholder");
        registerName.classList.remove("red-placeholder");
      })
      .catch(function () {
        registerUsername.value = "";
        alert("اسم المستخدم موجود بالفعل , من فضلك ادخل اسم مستخدم اخر");
        registerUsername.setAttribute("placeholder", "ادخل اسم مستخدم اخر");
        registerUsername.classList.add("red-placeholder");
      });
  }
}
