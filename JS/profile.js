
function getCurrentUser(){
  const params = new URLSearchParams(window.location.search);
  const userid = params.get("userid");
  return userid;
}

function showDashporad() {
  let id = getCurrentUser();
  axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`).then((response) => {
    let data = response.data.data;
    document.getElementById("email").innerHTML = `${data.email}`;
    document.getElementById("name").innerHTML = `${data.name}`;
    document.getElementById("username").innerHTML = `${data.username}`;
    document.getElementById("nameOfUserPost").innerHTML = `${data.username}'s Posts`
    document.getElementById(
      "postCount"
    ).innerHTML = `${data.posts_count}<sub>Post</sub>`;
    document.getElementById(
      "commentCount"
    ).innerHTML = `${data.comments_count}<sub>Comment</sub>`;
  });
}
showDashporad();

function getPostPageUser() {
  let id = getCurrentUser();
  let getPost = document.getElementById("userPost");
  axios
    .get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then(function (response) {
      let posts = response.data.data;
      getPost.innerHTML = "";
      if (!Array.isArray(posts)) {
        console.error("Unexpected data format:", posts);
        getPost.innerHTML = `<div class="alert alert-danger">حدث خطأ أثناء تحميل البيانات.</div>`;
        return;
      }

      if (posts.length > 0) {
        for (let post of posts) {
          let isMyPost =
            typeof user !== "undefined" && post.author.id === user.id;
          let buttonContent = "";
          if (isMyPost) {
            buttonContent = `
              <button onclick="editPostCreated('${encodeURIComponent(
              JSON.stringify(post)
            )}')" class="btn btn-secondary ms-10">edit</button>
              <button onclick="deletePostCreated('${encodeURIComponent(
              JSON.stringify(post)
            )}')" class="btn btn-danger ms-10">delete</button>
            `;
          }

          getPost.innerHTML += `
            <div class="container mt-5 col-lg-9" style="cursor: pointer;">
              <div class="card mb-4">
                <div class="card-header d-flex align-items-center">
                  <img src="${post.author.profile_image
              ? post.author.profile_image
              : "default-user.png"
            }" 
                       alt="User Image" class="rounded-circle" width="50" height="50">
                  <h6 class="ms-2 mb-0">${post.author.username}</h6>
                  ${buttonContent}
                </div>
                <div class="card-body">
                  <img src="${post.image ? post.image : "default-post.png"
            }" alt="" class="img-fluid rounded">
                </div>
                <div class="card-body">
                  <p>${post.body}</p>
                </div>
                <div class="card-footer">
                  <div class="d-flex justify-content-between">
                    <div>
                      <i class="fas fa-heart me-3 likeButton" style="font-size: 1.5em;"></i>
                      <i class="fas fa-comment-alt me-3 commentButton" style="font-size: 1.5em;"></i>
                    </div>
                    <span class="text-muted">${new Date(
              post.created_at
            ).toLocaleString()}</span>
                  </div>
                  <div class="mt-2" onclick="showIDuser(${post.author.id})">
                    <div>(${post.comments_count}) تعليق</div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      } else {
        getPost.innerHTML = `<div class="alert alert-info">لا توجد منشورات لعرضها.</div>`;
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
      getPost.innerHTML = `<div class="alert alert-danger">حدث خطأ أثناء تحميل المنشورات. حاول مرة أخرى لاحقًا.</div>`;
    });
}

getPostPageUser();

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
