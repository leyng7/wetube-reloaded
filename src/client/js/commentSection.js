const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.getElementById("video__comments");

const addComment = (text, id, avatarUrl, name) => {
  const videoComments = document.getElementById("video__comments");

  const newComment = document.createElement("div");
  newComment.className = "p-1 d-flex justify-content-between mb-2";
  newComment.dataset.id = id;

  const img = document.createElement("img");
  img.className = 'rounded-circle'
  img.src = avatarUrl;
  img.width = 45;
  img.height = 45;

  const flexDiv = document.createElement("div");
  flexDiv.className = 'd-flex';

  const div = document.createElement("div");
  div.className = 'ms-2';

  const nameDiv = document.createElement("div");
  nameDiv.innerText = name;

  const textDiv = document.createElement("div");
  textDiv.className = 'small';
  textDiv.innerText = text;

  const a = document.createElement("a");
  a.href = "#";
  a.innerText = "❌";

  div.appendChild(nameDiv);
  div.appendChild(textDiv);
  flexDiv.appendChild(img);
  flexDiv.appendChild(div);
  newComment.appendChild(flexDiv);
  newComment.appendChild(a);
  videoComments.prepend(newComment);
};

const handleSubmit = async event => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (!text) {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({text}),
  });
  if (response.status === 201) {
    textarea.value = "";
    const {newCommentId, avatarUrl, name} = await response.json();
    addComment(text, newCommentId, avatarUrl, name);
  }
};


const handleCommentDelete = async event => {
  if (event.target.tagName === "A" && confirm("삭제하시겠습니까?")) {
    const comment = event.target.parentNode;
    const videoId = videoContainer.dataset.id;
    const commentId = comment.dataset.id;

    const response = await fetch(`/api/videos/${videoId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response.status === 200) {
      event.target.parentNode.remove();
      alert("정상적으로 삭제 하였습니다.");
    } else {
      const {error} = await response.json();
      alert(error);
    };
  }
}

if (form) {
  form.addEventListener("submit", handleSubmit);
}

videoComments.addEventListener("click", handleCommentDelete);

