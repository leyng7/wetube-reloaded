const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  const videoComments = document.getElementById("video__comments");
  const newComment = document.createElement("div");
  newComment.className = "p-1 d-flex justify-content-between";
  newComment.dataset.id = id;
  const div = document.createElement("div");
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.className = "p-1";
  span.innerText = text;
  const a = document.createElement("a");
  a.href = "#";
  a.innerText = "❌";

  div.appendChild(icon);
  div.appendChild(span);
  newComment.appendChild(div);
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
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({text}),
  });
  if (response.status === 201) {
    textarea.value = "";
    const {newCommentId} = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

