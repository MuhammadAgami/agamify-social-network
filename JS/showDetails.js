function getComments() {
  // جلب postId من URL
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("postId");


  // إجراء طلب GET لجلب بيانات المنشور والتعليقات
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${postId}`)
    .then(function (response) {
      let post = response.data.data; // الحصول على بيانات المنشور
      let comments = post.comments; // استخراج التعليقات
      let commentContent = ""; // محتوى التعليقات الذي سيتم إضافته إلى الصفحة

      console.log(post);

      // بناء محتوى التعليقات
      for (let comment of comments) {
        console.log(comment);
        commentContent += `
          <div class="d-flex align-items-center bg-light mt-3">
            <img src="${comment.author.profile_image || "default-avatar.png"
          }" height="50" width="50" class="mx-3 rounded-circle">
            <div>
              <h6>${comment.author.name}</h6>
              <p>${comment.body}</p>
            </div>
          </div>`;
      }

      // عرض تفاصيل المنشور والتعليقات
      document.getElementById("GoShowDatails").innerHTML = `
        <div class="container mt-5 col-lg-10" style="cursor: pointer;">
          <div class="card mb-4">
            <div class="card-header d-flex align-items-center">
              <img src="${post.author.profile_image || "default-avatar.png"
        }" alt="User Image" class="rounded-circle" width="50" height="50">
              <h6 class="ms-2 mb-0">${post.author.username}</h6>
            </div>
            <div class="card-body">
              <img src="${post.image}" alt="" class="img-fluid rounded">
            </div>
            <div class="card-body">
              <p>${post.body}</p>
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between">
                <div>
                  <i class="fas fa-comment-alt me-3 commentButton" style="font-size: 1.5em;"></i>
                </div>
                <span class="text-muted">${post.created_at}</span>
              </div>
              <div id="commentSection" class="mt-2">
                ${commentContent}
              </div>
              <div class="d-flex mt-3">
                <input id="inputComment" type="text" class="form-control" placeholder="أضف تعليق...">
                <button class="btn btn-primary ms-2" onclick="writeComment(${postId})">إرسال</button>
              </div>
            </div>
          </div>
        </div>
        `;
    })
    .catch((error) => {
      console.error("Error fetching post data:", error);
    });
}

getComments();

function writeComment(postId) {
  let inputComment = document.getElementById("inputComment").value;

  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
      { body: inputComment },
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
    .then((response) => {
      let newComment = response.data.data;
      document.getElementById("commentSection").innerHTML += `
        <div class="d-flex align-items-center bg-light mt-3">
          <img src="${newComment.author.profile_image || "default-avatar.png"
        }" height="50" width="50" class="mx-3 rounded-circle">
          <div>
            <h6>${newComment.author.name}</h6>
            <p>${newComment.body}</p>
          </div>
        </div>`;
      document.getElementById("inputComment").value = "";
    })
    .catch((error) => {
      console.error("Error posting comment:", error);
      alert("حدث خطأ أثناء إرسال التعليق. يرجى المحاولة مرة أخرى.");
    });
}
