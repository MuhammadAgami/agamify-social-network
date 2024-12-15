// this is function logout
function logoutPage() {
  localStorage.clear();
  location.href = "../index.html";
}
// **********************************************************************

// the userInformationPage start

function userInformationPage() {
  let userInformation = document.getElementById("userInformation");
  if (localStorage.token) {
    userInformation.innerHTML = `
              <img
                src="${JSON.parse(localStorage.user).profile_image}"
                alt=""
                height="50"
                width="50"
                class="rounded-circle"
              />
              <span class="mx-2" id="username">${JSON.parse(localStorage.user).username
      }</span>
            `;
  }
}

userInformationPage();

function getCurrentUser() {
  let user = null;
  let storedUser = localStorage.getItem("user"); // استرجاع البيانات من localStorage

  if (storedUser !== null) {
    user = JSON.parse(storedUser); // تحويل النص إلى كائن JSON
  }

  return user;
}
