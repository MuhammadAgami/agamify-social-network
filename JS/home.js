// This state is responsible for transferring the registered user to his personal page and seeing all his posts and all his data.
function profileClicked() {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const userid = parsedUser.id || parsedUser.userid;

      if (userid) {
        window.location.href = `../HTML/profile.html?userid=${userid}`;
      } else {
        console.error('User ID is missing in the stored data.');
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
    }
  } else {
    console.error('No user data found in localStorage.');
  }
}
// *****************************************************
// show id of user ot change comment Show Details
function showIDuser(id) {
  window.location = `showDetails.html?postId=${id}`;
}
function ShowDetails(id) {
  window.location = `../HTML/showDetails.html?postId=${id}`;
}
// ****************************************************
// show click icon
function togglePostPage() {
  const postPage = document.getElementById("posterPage");
  if (postPage.style.display === "none") {
    postPage.style.display = "block";
  } else {
    postPage.style.display = "none";
  }
}

let currentPage = 1;
let totalPostsLoaded = 0;
let isLoading = false;

window.addEventListener("scroll", function () {
  const endOfPage =
    this.innerHeight + this.pageYOffset >= document.body.offsetHeight - 50;

  if (endOfPage && !isLoading && totalPostsLoaded < 100) {
    getPostPage(currentPage + 1);
    currentPage++;
  }
});

// show the posts of all

function getPostPage(page = 1) {
  let getPost = document.getElementById("getPost");
  let user = getCurrentUser();
  let totalPostsLoaded = 0;
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts?limit=20&page=${page}`)
    .then(function (response) {
      let posts = response.data.data;

      if (posts && posts.length > 0) {
        for (let post of posts) {
          // التحقق مما إذا كان المنشور للمستخدم الحالي
          let isMyPost = user != null && post.author.id == user.id;

          // إنشاء زر التعديل إذا كان المنشور للمستخدم
          let buttonContent = "";
          if (isMyPost) {
            buttonContent = `<button onclick="editPostCreated('${encodeURIComponent(
              JSON.stringify(post)
            )}')" class="btn btn-outline-secondary ms-10">تعديل</button>
            <button onclick="deletePostCreated('${encodeURIComponent(
              JSON.stringify(post)
            )}')" class="btn btn-outline-danger ms-10">حذف</button>
             `;
          }

          // إضافة المنشور إلى الصفحة
          getPost.innerHTML += `
            <div class="container mt-5 col-lg-9">
              <div class="card mb-4">
                <div class="card-header d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center" style="cursor:pointer" onclick="userClicked(${post.author.id})">
                    <img src="${post.author.profile_image || "default-user.png"
            }" alt="User Image" class="rounded-circle" width="50" height="50">
                    <h6 class="ms-2 mb-0">${post.author.username}</h6>
                  </div>
                  <div>
                    ${buttonContent}
                  </div>
                </div>
                <div class="card-body">
                  <img src="${post.image || "default-post.png"
            }" alt="" class="img-fluid rounded">
                </div>
                <div class="card-body">
                  <p>${post.body}</p>
                </div>
                <div class="card-footer" onclick="showIDuser(${post.author.id
            })" style="cursor:pointer">
                  <div class="d-flex justify-content-between">
                    <div>
                      <i class="fas fa-comment-alt me-3 commentButton" style="font-size: 1.5em;"></i>
                    </div>
                    <span class="text-muted">${post.created_at}</span>
                  </div>
                  <div class="mt-2">
                    <div>(${post.comments_count}) تعليق</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
        totalPostsLoaded += posts.length;

        // رسالة عند تحميل 100 منشور
        if (totalPostsLoaded >= 100) {
          console.log("تم تحميل 100 منشور");
        }
      } else {
        console.log("لا توجد بيانات إضافية لتحميلها");
      }
      isLoading = false; // إنهاء التحميل
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
      isLoading = false; // إنهاء التحميل عند الخطأ
    });
}

function addEventListenersToPosts() {
  document.querySelectorAll(".likeButton").forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });

  document.querySelectorAll(".commentButton").forEach((button) => {
    button.addEventListener("click", function () {
      alert("أضف تعليقك...");
    });
  });
}

getPostPage();

function createPost() {
  let createAndEditPost = document.getElementById("createAndEditPost").value;
  let isCreated = !createAndEditPost;
  let postTitle = document.getElementById("postTitle").value;
  let postContent = document.getElementById("postContent").value;
  let postImage = document.getElementById("postImage").files[0];
  if (!postTitle || !postContent || !postImage) {
    alert("يرجى ملء جميع الحقول واختيار صورة.");
    return;
  }
  let formData = new FormData();
  formData.append("title", postTitle);
  formData.append("body", postContent);
  formData.append("image", postImage);
  let headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  let url = `https://tarmeezacademy.com/api/v1/posts`;
  if (isCreated) {
    // إنشاء منشور جديد
    axios
      .post(url, formData, { headers: headers })
      .then(function (response) {
        console.log("تم إنشاء المنشور بنجاح:", response);
        alert("تم إنشاء المنشور بنجاح:");
        location.reload();
      })
      .catch(function (error) {
        console.error("حدث خطأ أثناء إنشاء المنشور:", error);
        alert("An error occurred while creating the post. Please try again.");
      });
  } else {
    // تعديل منشور موجود
    formData.append("_method", "put"); // إضافة المعلمة لتحويل الطلب إلى PUT
    url = `https://tarmeezacademy.com/api/v1/posts/${createAndEditPost}`;
    axios
      .post(url, formData, { headers: headers }) // لا يزال يتم استخدام POST
      .then(function (response) {
        console.log("تم تعديل المنشور بنجاح:", response);
        alert("تم تعديل المنشور بنجاح!");
        location.reload();
      })
      .catch(function (error) {
        console.error("حدث خطأ أثناء تعديل المنشور:", error);
        alert("An error occurred while updating the post. Please try again.");
      });
  }
  getPostPage();
}

// ***************************************************************
// function edit Post
function editPostCreated(post) {
  let postUser = JSON.parse(decodeURIComponent(post));
  console.log(postUser);
  let titleANewPost = document.getElementById("titleANewPost");
  let postTitle = document.getElementById("postTitle");
  let postContent = document.getElementById("postContent");
  let postImage = document.getElementById("postImage");
  let createAndEditPost = document.getElementById("createAndEditPost");
  createAndEditPost.value = postUser.id;
  postTitle.value = postUser.title;
  postContent.value = postUser.body;
  postImage.files[0] = postImage.image;
  let CreateUpdatePost = document.getElementById("CreateUpdatePost");
  window.scrollTo(0, 0);
  togglePostPage();
  titleANewPost.innerHTML = "تعديل هذا المنشور";
  CreateUpdatePost.innerHTML = "تعديل";
}
// ***************************************************************
// function delete post
function deletePostCreated(post) {
  let postUser = JSON.parse(decodeURIComponent(post));
  let postId = postUser.id;
  if (!confirm("هل أنت متأكد أنك تريد حذف هذا المنشور؟")) {
    return;
  }

  let url = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
  let headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  axios
    .delete(url, { headers: headers })
    .then(function (response) {
      console.log("تم حذف المنشور بنجاح:", response);
      alert("تم حذف المنشور بنجاج");
      location.reload();
    })
    .catch(function (error) {
      console.error("حدث خطأ أثناء حذف المنشور:", error);
      alert("An error occurred while deleting the post. Please try again.");
    });
}

function userClicked(id) {
  window.location = `../HTML/profile.html?userid=${id}`;
}