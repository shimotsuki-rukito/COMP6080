//import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
//import { fileToDataUrl } from "./helpers.js";

const apiBaseUrl = "http://localhost:5005/";

let currentThreadId = null;

function apiCall(path, method, body, token) {
  const headers = {
    "Content-type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method: method,
    headers: headers,
  };

  // Only add body for methods other than 'GET' and 'HEAD'
  if (method !== "GET" && method !== "HEAD" && body !== null) {
    fetchOptions.body = JSON.stringify(body);
  }

  return fetch(apiBaseUrl + path, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    });
}

function showError(message) {
  alert(message);
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  apiCall("auth/login", "POST", { email, password }).then((data) => {
    if (data.error) {
      showError(data.error);
    } else {
      // Handle successful login (e.g., store token in local storage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      showDashboard();
      console.log("Login successful");
    }
  });
}

function register() {
  const email = document.getElementById("registerEmail").value;
  const name = document.getElementById("registerName").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  apiCall("auth/register", "POST", { email, name, password }).then((data) => {
    if (data.error) {
      showError(data.error);
    } else {
      // Handle successful registration
      showLoginForm();
      console.log("Registration successful");
    }
  });
}

let startIndex = 0;

function loadThreads() {
  apiCall(
    `threads?start=${startIndex}`,
    "GET",
    null,
    localStorage.getItem("token")
  )
    .then((threadIds) => {
      if (threadIds.length === 0) {
        document.getElementById("loadMoreButton").style.display = "none";
      } else {
        startIndex += threadIds.length;

        const threadDetailsPromises = threadIds.map((threadId) => {
          return apiCall(
            `thread?id=${threadId}`,
            "GET",
            null,
            localStorage.getItem("token")
          );
        });

        Promise.all(threadDetailsPromises)
          .then((threadsDetails) => {
            // Sort thread details in reverse order by creation time
            threadsDetails.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            threadsDetails.forEach((threadDetails) => {
              displayThread(threadDetails);
            });
          })
          .catch((error) => {
            console.error("Error loading thread details:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error loading thread IDs:", error);
    });
}

function loadMoreThreads() {
  loadThreads(); // Call the loadThreads function to load more posts
}

function getUserInfo(userId) {
  return apiCall(
    `user?userId=${userId}`,
    "GET",
    null,
    localStorage.getItem("token")
  )
    .then((userInfo) => {
      return userInfo; // Return the entire user information object
    })
    .catch((error) => {
      console.error("Error loading user info:", error);
      return null; // Return null or appropriate default value in error situations
    });
}

function displayThread(thread) {
  getUserInfo(thread.creatorId).then((userInfo) => {
    const userName = userInfo ? userInfo.name : "Unknown User";
    const threadList = document.getElementById("threadList");
    const threadElement = document.createElement("div");

    const titleElement = document.createElement("h4");
    titleElement.textContent = thread.title;
    threadElement.appendChild(titleElement);

    const contentElement = document.createElement("p");
    contentElement.textContent = thread.content;
    threadElement.appendChild(contentElement);

    const infoElement = document.createElement("p");
    infoElement.textContent = `Posted by: ${userName} on ${new Date(thread.createdAt).toLocaleDateString()}`;
    threadElement.appendChild(infoElement);

    threadElement.onclick = () => {
      viewThread(thread);
    };

    threadList.appendChild(threadElement);
  });
}

function showRegisterForm() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

function showLoginForm() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

function showDashboard() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("createThreadForm").style.display = "none";
  document.getElementById("editThreadForm").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("loadMoreButton").style.display = "block";
  const threadList = document.getElementById("threadList");
  while (threadList.firstChild) {
    threadList.removeChild(threadList.firstChild);
  }
  let createButton = document.getElementById("createButton");
  if (!createButton) {
    createButton = document.createElement("button");
    createButton.innerText = "Create";
    createButton.id = "createButton";
    createButton.onclick = showCreateThreadForm;
    document.getElementById("dashboard").prepend(createButton);
  }

  let userProfileButton = document.getElementById("userProfileButton");
  if (!userProfileButton) {
    userProfileButton = document.createElement("button");
    userProfileButton.innerText = "Profile";
    userProfileButton.id = "userProfileButton";
    userProfileButton.onclick = () =>
      showUserProfile(localStorage.getItem("userId"));
    document.getElementById("dashboard").prepend(userProfileButton);
  }
  // Reset Start Index
  startIndex = 0;
  loadThreads();
  setupBackToDashboardButton();
}

function logout() {
  localStorage.removeItem("token");
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
}

function showCreateThreadForm() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("createThreadForm").style.display = "block";
}

function createThread() {
  const title = document.getElementById("threadTitle").value;
  const content = document.getElementById("threadContent").value;
  const isPublic = document.getElementById("threadIsPublic").checked;

  apiCall(
    "thread",
    "POST",
    { title, isPublic, content },
    localStorage.getItem("token")
  ).then((data) => {
    if (data.error) {
      showError(data.error);
    } else {
      // Redirect to the newly created thread's view
      showDashboard();
    }
  });
}

function handleMediaQueryChange(mediaQuery) {
  if (mediaQuery.matches) {
    // When the screen width is greater than or equal to 768px
    document.getElementById("threadList").style.display = "block";
    document.getElementById("loadMoreButton").style.display = "block";
    document.getElementById("threadDetails").style.display = "block";
    document.getElementById("threadDetails").style.marginTop = "0px";
    document.getElementById("threadDetails").style.paddingLeft = "20px";
    let backButton = document.getElementById("backButton");
    if (backButton) {
      backButton.remove(); // If the return button exists, remove it
    }
  } else {
    // When the screen width is less than 768px
    document.getElementById("threadList").style.display = "block";
    document.getElementById("loadMoreButton").style.display = "block";
    document.getElementById("threadDetails").style.display = "none"; // Hide threadDetails
  }
}

// Set media queries
const mediaQuery = window.matchMedia("(min-width: 768px)");
handleMediaQueryChange(mediaQuery); // Directly call once to set the initial state
mediaQuery.addEventListener("change", handleMediaQueryChange); // Add a listener to respond to changes in screen width

function viewThread(thread) {
  currentThreadId = thread.id;
  apiCall(
    `thread?id=${currentThreadId}`,
    "GET",
    null,
    localStorage.getItem("token")
  ).then((updatedThread) => {
    const threadDetails = document.getElementById("threadDetails");
    while (threadDetails.firstChild) {
      threadDetails.removeChild(threadDetails.firstChild);
    }

    const titleElement = document.createElement("h3");
    titleElement.textContent = updatedThread.title;
    threadDetails.appendChild(titleElement);

    const contentElement = document.createElement("p");
    contentElement.textContent = updatedThread.content;
    threadDetails.appendChild(contentElement);

    const likesElement = document.createElement("p");
    likesElement.textContent = `Likes: ${Object.keys(updatedThread.likes || {}).length}`;
    threadDetails.appendChild(likesElement);

    const watchingElement = document.createElement("p");
    watchingElement.textContent = `Watching: ${Object.keys(updatedThread.watchees || {}).length}`;
    threadDetails.appendChild(watchingElement);
    threadDetails.style.display = "block";

    function addBackButton() {
      let backButton = document.getElementById("backButton");
      if (!backButton) {
        backButton = document.createElement("button");
        backButton.id = "backButton";
        backButton.textContent = "Back";
        document.getElementById("threadDetails").prepend(backButton);

        // Behavior when clicking the return button
        backButton.addEventListener("click", () => {
          document.getElementById("threadList").style.display = "block";
          document.getElementById("threadDetails").style.display = "none";
          // Remove the return button and only display it when needed
          backButton.remove();
        });
      }
    }

    if (!mediaQuery.matches) {
      document.getElementById("threadList").style.display = "none";
      document.getElementById("loadMoreButton").style.display = "none";
      document.getElementById("threadDetails").style.display = "block";
      document.getElementById("threadDetails").style.marginTop = "20px";
      document.getElementById("threadDetails").style.paddingLeft = "0";
      addBackButton();
    }

    getUserInfo(localStorage.getItem("userId")).then((userInfo) => {
      if (userInfo.admin || userInfo.id === thread.creatorId) {
        const editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = () => showEditForm(thread);
        threadDetails.appendChild(editButton);
      }
    });

    getUserInfo(localStorage.getItem("userId")).then((userInfo) => {
      if (userInfo.admin || userInfo.id === thread.creatorId) {
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => deleteThread(thread.id);
        threadDetails.appendChild(deleteButton);
      }
    });

    getUserInfo(localStorage.getItem("userId")).then((userInfo) => {
      //No effect, to avoid asynchronous operations causing button position errors
      if (true) {
        const userId = localStorage.getItem("userId");
        const userIdNumber = parseInt(userId, 10);
        const hasLiked = updatedThread.likes.includes(userIdNumber);
        console.log("hasLiked", hasLiked);
        const likeButton = document.createElement("button");
        likeButton.innerText = hasLiked ? "Unlike" : "Like";
        likeButton.className = hasLiked ? "liked" : "";
        likeButton.disabled = thread.lock; // If the thread is locked, disable the like button
        likeButton.onclick = () => toggleLike(thread.id, !hasLiked);

        threadDetails.appendChild(likeButton);

        const isWatching = updatedThread.watchees.includes(userIdNumber);
        const watchButton = document.createElement("button");
        watchButton.innerText = isWatching ? "Not watching" : "Watching";
        watchButton.className = isWatching ? "watching" : "";
        watchButton.disabled = thread.lock;
        watchButton.onclick = () => toggleWatch(thread.id, !isWatching);

        threadDetails.appendChild(watchButton);

        const commentSection = document.createElement("div");
        commentSection.id = "commentSection";

        const commentInput = document.createElement("textarea");
        commentInput.id = "commentInput";
        commentInput.placeholder = "Add a comment...";

        const commentButton = document.createElement("button");
        commentButton.innerText = "Comment";
        commentButton.onclick = () => postComment(thread.id, null); // Null indicates that this is a top-level comment without a parent comment

        commentSection.appendChild(commentInput);
        commentSection.appendChild(commentButton);

        threadDetails.appendChild(commentSection);

        // If the thread is locked, disable comment input boxes and buttons
        if (thread.lock) {
          commentInput.disabled = true;
          commentButton.disabled = true;
        }

        loadComments(thread.id);
      }
    });
  });
}

function removeOldBackButton() {
  const oldBackBtn = document.querySelector(".back-to-threadlist");
  if (oldBackBtn) {
    oldBackBtn.parentNode.removeChild(oldBackBtn);
  }
}

function showEditForm(thread) {
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("threadList").style.display = "none";
  document.getElementById("threadDetails").style.display = "none";

  document.getElementById("editThreadTitle").value = thread.title;
  document.getElementById("editThreadContent").value = thread.content;
  document.getElementById("editThreadIsPublic").checked = thread.isPublic;
  document.getElementById("editThreadIsLocked").checked = thread.lock;

  document.getElementById("editThreadForm").style.display = "block";
  window.scrollTo(0, 0); // Scroll to the top of the page to ensure the form is in view

  // Save the thread ID currently being edited
  document.getElementById("editThreadForm").dataset.threadId = thread.id;
}

function saveEditedThread() {
  const threadId = document.getElementById("editThreadForm").dataset.threadId;
  const title = document.getElementById("editThreadTitle").value;
  const content = document.getElementById("editThreadContent").value;
  const isPublic = document.getElementById("editThreadIsPublic").checked;
  const lock = document.getElementById("editThreadIsLocked").checked;

  apiCall(
    "thread",
    "PUT",
    { id: threadId, title, isPublic, lock, content },
    localStorage.getItem("token")
  ).then((data) => {
    if (data.error) {
      showError(data.error);
    } else {
      document.getElementById("threadList").style.display = "block";
      document.getElementById("loadMoreButton").style.display = "block";
      showDashboard();
    }
  });
}

function deleteThread(threadId) {
  apiCall(`thread`, "DELETE", { id: threadId }, localStorage.getItem("token"))
    .then((data) => {
      if (data.error) {
        showError(data.error);
      } else {
        const threadDetails = document.getElementById("threadDetails");
        threadDetails.style.display = "none";
        while (threadDetails.firstChild) {
          threadDetails.removeChild(threadDetails.firstChild);
        }

        const threadList = document.getElementById("threadList");
        while (threadList.firstChild) {
          threadList.removeChild(threadList.firstChild);
        }
        startIndex = 0;
        loadThreads().then((firstThread) => {
          if (firstThread) {
            viewThread(firstThread);
          } else {
            // If there are no more threads, clear the details area
            while (threadDetails.firstChild) {
              threadDetails.removeChild(threadDetails.firstChild);
            }
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error deleting thread:", error);
    });
}

function toggleLike(threadId, turnon) {
  apiCall(
    `thread/like`,
    "PUT",
    { id: threadId, turnon },
    localStorage.getItem("token")
  )
    .then((response) => {
      if (response.error) {
        showError(response.error);
      } else {
        // After successfully liking or canceling liking, reload thread details to update liking status and count
        loadThreadDetails(threadId);
        console.log("Like toggled successfully");
      }
    })
    .catch((error) => {
      console.error("Error toggling like:", error);
    });
}

function toggleWatch(threadId, turnon) {
  apiCall(
    `thread/watch`,
    "PUT",
    { id: threadId, turnon },
    localStorage.getItem("token")
  )
    .then((response) => {
      if (response.error) {
        showError(response.error);
      } else {
        loadThreadDetails(threadId);
      }
    })
    .catch((error) => {
      console.error("Error toggling watch:", error);
    });
}

function loadThreadDetails(threadId) {
  apiCall(`thread?id=${threadId}`, "GET", null, localStorage.getItem("token"))
    .then((threadDetails) => {
      viewThread(threadDetails);
    })
    .catch((error) => {
      console.error("Error loading thread details:", error);
    });
}

function loadComments(threadId) {
  const commentSection = document.getElementById("commentSection");
  let commentsList = document.getElementById("commentsList");

  if (!commentsList) {
    commentsList = document.createElement("div");
    commentsList.id = "commentsList";
    commentSection.appendChild(commentsList);
  } else {
    while (commentsList.firstChild) {
      commentsList.removeChild(commentsList.firstChild);
    }
  }

  apiCall(
    `comments?threadId=${threadId}`,
    "GET",
    null,
    localStorage.getItem("token")
  )
    .then((comments) => {
      // Sort comments in reverse order of creation time
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Group comments by parentCommentId
      const commentsByParentId = comments.reduce((acc, comment) => {
        const parentId = comment.parentCommentId || "root";
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(comment);
        return acc;
      }, {});

      // Recursive functions are used to create and display comments and nested replies
      const displayComments = (parentId, depth = 0) => {
        (commentsByParentId[parentId] || []).forEach((comment) => {
          getUserInfo(comment.creatorId).then((userInfo) => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            // Set a unique ID based on the comment ID for each comment element
            commentElement.id = `comment-${comment.id}`;
            commentElement.style.marginLeft = `${depth * 40}px`; // Apply Indent
            const img = document.createElement("img");
            img.className = "userImageClick";
            img.onclick = () => showUserProfile(comment.creatorId);
            img.src = userInfo.image;
            img.width = 50;
            img.height = 50;
            commentElement.appendChild(img);

            // Create and append the user name span
            const userNameSpan = document.createElement("span");
            userNameSpan.className = "userImageClick";
            userNameSpan.onclick = () => showUserProfile(comment.creatorId);
            userNameSpan.textContent = userInfo.name;
            commentElement.appendChild(userNameSpan);

            // Create and append the comment content paragraph
            const contentP = document.createElement("p");
            contentP.textContent = comment.content;
            commentElement.appendChild(contentP);

            // Create and append the likes count paragraph
            const likesP = document.createElement("p");
            likesP.textContent = `Likes: ${Object.keys(comment.likes || {}).length}`;
            commentElement.appendChild(likesP);

            // Create and append the time since paragraph
            const timeP = document.createElement("p");
            timeP.textContent = formatTimeSince(comment.createdAt);
            commentElement.appendChild(timeP);

            commentsList.appendChild(commentElement);

            getUserInfo(localStorage.getItem("userId")).then((currentUser) => {
              if (currentUser.id === comment.creatorId || currentUser.admin) {
                const editButton = document.createElement("button");
                editButton.innerText = "Edit";
                editButton.onclick = () =>
                  showEditCommentForm(comment, threadId);
                commentElement.appendChild(editButton);
                const deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.onclick = () => deleteComment(comment.id);
                commentElement.appendChild(deleteButton);
              }
              const userId = localStorage.getItem("userId");
              const userIdNumber = parseInt(userId, 10);
              const hasLiked = comment.likes.includes(userIdNumber);

              const likeButton = document.createElement("button");
              likeButton.innerText = hasLiked ? "Unlike" : "Like";
              likeButton.className = hasLiked ? "liked" : "";
              likeButton.onclick = () =>
                toggleCommentLike(comment.id, !hasLiked);

              commentElement.appendChild(likeButton);

              const replyButton = document.createElement("button");
              replyButton.innerText = "Reply";
              replyButton.onclick = () => showReplyForm(comment.id);
              commentElement.appendChild(replyButton);
            });

            commentsList.appendChild(commentElement);

            // Recursive display of nested replies
            displayComments(comment.id, depth + 1);
          });
        });
      };

      // Display from root comment
      displayComments("root");
    })
    .catch((error) => {
      console.error("Error loading comments:", error);
    });
}

function formatTimeSince(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + " year(s) ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " month(s) ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " day(s) ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hour(s) ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minute(s) ago";

  return "Just now";
}

function postComment(threadId, parentCommentId, content) {
  //const content = document.getElementById("commentInput").value;
  if (!content) {
    content = document.getElementById("commentInput").value;
  }
  if (!content.trim()) return; // If the input is empty or only contains spaces, no action is taken

  apiCall(
    "comment",
    "POST",
    { content, threadId, parentCommentId },
    localStorage.getItem("token")
  )
    .then((response) => {
      if (response.error) {
        showError(response.error);
      } else {
        // After the comment is successfully published, clear the input box and reload the comment
        document.getElementById("commentInput").value = "";
        loadComments(threadId);
      }
    })
    .catch((error) => {
      console.error("Error posting comment:", error);
    });
}

function showEditCommentForm(comment, threadId) {
  const existingModal = document.getElementById("editCommentModal");
  if (existingModal) {
    existingModal.remove();
  }
  const modal = document.createElement("div");
  modal.id = "editCommentModal";
  modal.dataset.threadId = threadId;
  const textarea = document.createElement("textarea");
  textarea.id = "editCommentInput";
  textarea.textContent = comment.content;

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.addEventListener("click", () => updateComment(comment.id));

  modal.appendChild(textarea);
  modal.appendChild(submitButton);
  commentsList.appendChild(modal);
  // Show the logic of the modal box
}

function updateComment(commentId) {
  const modal = document.getElementById("editCommentModal");
  const threadId = modal.dataset.threadId;
  const content = document.getElementById("editCommentInput").value;
  apiCall(
    "comment",
    "PUT",
    { id: commentId, content },
    localStorage.getItem("token")
  )
    .then((response) => {
      if (response.error) {
        showError(response.error);
      } else {
        // Close and remove the modal box for editing comments
        const modal = document.getElementById("editCommentModal");
        modal.parentNode.removeChild(modal); // Using the parent node of a module to remove it
        // Reload comments to display updated content
        loadComments(threadId);
      }
    })
    .catch((error) => {
      console.error("Error updating comment:", error);
    });
}

function toggleCommentLike(commentId, turnon) {
  apiCall(
    `comment/like`,
    "PUT",
    { id: commentId, turnon },
    localStorage.getItem("token")
  )
    .then((response) => {
      if (response.error) {
        showError(response.error);
      } else {
        // Reload comments to refresh the likes counter
        loadComments(currentThreadId);
      }
    })
    .catch((error) => {
      console.error("Error toggling comment like:", error);
    });
}

function deleteComment(commentId) {
  apiCall(`comment`, "DELETE", { id: commentId }, localStorage.getItem("token"))
    .then((response) => {
      if (response.error) {
        showError(response.error);
      } else {
        console.log("Comment deleted successfully");
        // After successfully deleting the comment, reload the comment to update the display
        loadComments(currentThreadId);
      }
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);
    });
}

function showReplyForm(parentCommentId) {
  const existingReplyModal = document.getElementById("replyModal");
  if (existingReplyModal) {
    existingReplyModal.remove();
  }

  const replyModal = document.createElement("div");
  replyModal.id = "replyModal";
  const replyInput = document.createElement("textarea");
  replyInput.id = "replyInput";
  replyInput.placeholder = "Write your reply...";

  const submitReplyButton = document.createElement("button");
  submitReplyButton.id = "submitReply";
  submitReplyButton.textContent = "Reply";

  replyModal.appendChild(replyInput);
  replyModal.appendChild(submitReplyButton);

  // Find the comment element to reply to
  const parentCommentElement = document.getElementById(
    `comment-${parentCommentId}`
  );
  if (parentCommentElement) {
    // Insert the reply modal box as the next sibling element of the comment element
    parentCommentElement.parentNode.insertBefore(
      replyModal,
      parentCommentElement.nextSibling
    );
  } else {
    // If the parent comment element cannot be found, fallback to adding the reply modal box to the end of the comment list
    commentsList.appendChild(replyModal);
  }

  // Set the logic when clicking the "reply" button
  document.getElementById("submitReply").onclick = () => {
    const replyContent = document.getElementById("replyInput").value;
    if (!replyContent.trim()) {
      alert("Reply cannot be empty!");
      return;
    }

    // Submit a reply as a new comment
    postComment(currentThreadId, parentCommentId, replyContent);

    // Remove reply mode box
    replyModal.remove();
  };
}

function showUserProfile(userId) {
  console.log("showUserProfile", userId);
  const userProfile = document.getElementById("userProfile");
  const userInfo = document.getElementById("userInfo");
  const userThreads = document.getElementById("userThreads");
  const adminForm = document.getElementById("adminForm");

  // If adminForm already exists, remove it
  if (adminForm) {
    adminForm.remove();
  }

  userProfile.style.display = "block";
  document.getElementById("dashboard").style.display = "none";
  while (userInfo.firstChild) {
    userInfo.removeChild(userInfo.firstChild);
  }
  while (userThreads.firstChild) {
    userThreads.removeChild(userThreads.firstChild);
  }

  // Obtain user information
  apiCall(
    `user?userId=${userId}`,
    "GET",
    null,
    localStorage.getItem("token")
  ).then((userData) => {
    while (userInfo.firstChild) {
      userInfo.removeChild(userInfo.firstChild);
    }

    const img = document.createElement("img");
    img.src = userData.image;
    img.alt = "Profile Image";
    img.width = 100;
    userInfo.appendChild(img);
    const nameP = document.createElement("p");
    nameP.textContent = `Name: ${userData.name}`;
    userInfo.appendChild(nameP);

    const emailP = document.createElement("p");
    emailP.textContent = `Email: ${userData.email}`;
    userInfo.appendChild(emailP);

    const threadsHeader = document.createElement("h3");
    threadsHeader.textContent = "User Threads";
    userInfo.appendChild(threadsHeader);
  });

  // Get all post IDs
  apiCall(`threads?start=0`, "GET", null, localStorage.getItem("token")).then(
    (threadIds) => {
      // For each post ID, obtain detailed information about the post
      const threadDetailsPromises = threadIds.map((threadId) => {
        return apiCall(
          `thread?id=${threadId}`,
          "GET",
          null,
          localStorage.getItem("token")
        );
      });

      Promise.all(threadDetailsPromises).then((threadsDetails) => {
        // Filter out posts from specific users
        const userThreadsDetails = threadsDetails.filter(
          (thread) => thread.creatorId == userId
        );

        // For each user's post, obtain comments and calculate the quantity
        userThreadsDetails.forEach((thread) => {
          apiCall(
            `comments?threadId=${thread.id}`,
            "GET",
            null,
            localStorage.getItem("token")
          ).then((comments) => {
            const threadElement = document.createElement("div");
            const titleH3 = document.createElement("h3");
            titleH3.textContent = thread.title;
            threadElement.appendChild(titleH3);

            // Create and append the thread content paragraph
            const contentP = document.createElement("p");
            contentP.textContent = thread.content;
            threadElement.appendChild(contentP);

            // Create and append the likes and comments counts paragraph
            const statsP = document.createElement("p");
            statsP.textContent = `Likes: ${Object.keys(thread.likes || {}).length}\u00A0\u00A0\u00A0\u00A0Comments: ${comments.length}`;
            threadElement.appendChild(statsP);
            userThreads.appendChild(threadElement);
          });
        });
      });
    }
  );

  if (userId == localStorage.getItem("userId")) {
    document.getElementById("updateProfileForm").style.display = "block";
  } else {
    document.getElementById("updateProfileForm").style.display = "none";
  }

  getUserInfo(localStorage.getItem("userId")).then((currentUser) => {
    if (currentUser.admin && currentUser.id != userId) {
      // Ensure that the administrator is not viewing their own information
      const adminForm = document.createElement("div");
      adminForm.id = "adminForm";

      // Create a dropdown list
      const adminDropdown = document.createElement("select");
      adminDropdown.id = "adminStatus";
      const userOption = new Option("User", false);
      const adminOption = new Option("Admin", true);
      adminDropdown.add(userOption);
      adminDropdown.add(adminOption);

      // Set default options for the drop-down list based on the administrator status of the currently viewed user
      getUserInfo(userId).then((profileUser) => {
        adminDropdown.value = profileUser.admin;
      });

      const updateButton = document.createElement("button");
      updateButton.textContent = "Update";
      updateButton.onclick = () =>
        updateAdminStatus(userId, adminDropdown.value);

      adminForm.appendChild(adminDropdown);
      adminForm.appendChild(updateButton);

      const userProfile = document.getElementById("userProfile");
      userProfile.appendChild(adminForm);
    }
  });
}

function setupBackToDashboardButton() {
  const backToDashboardButton = document.getElementById(
    "backToDashboardButton"
  );
  backToDashboardButton.onclick = () => {
    document.getElementById("userProfile").style.display = "none";
    showDashboard();
  };
}

function updateProfile() {
  const email = document.getElementById("updateEmail").value;
  const name = document.getElementById("updateName").value;
  const password = document.getElementById("updatePassword").value;
  const imageInput = document.getElementById("updateImage");

  // Process image upload
  const reader = new FileReader();
  reader.onload = function (e) {
    const image = e.target.result; // Obtain base64 encoded images

    // Call API to update user information
    apiCall(
      "user",
      "PUT",
      { email, password, name, image },
      localStorage.getItem("token")
    )
      .then((response) => {
        if (response.error) {
          showError(response.error);
        } else {
          alert("Profile updated successfully.");
          showUserProfile(localStorage.getItem("userId"));
          // Display updated personal information after successful update
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  if (imageInput.files.length > 0) {
    // If the user selects an image, read the image content
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    // If no image is selected, update other information directly
    apiCall(
      "user",
      "PUT",
      { email, password, name },
      localStorage.getItem("token")
    )
      .then((response) => {
        if (response.error) {
          showError(response.error);
        } else {
          alert("Profile updated successfully.");
          showUserProfile(localStorage.getItem("userId"));
          // Display updated personal information after successful update
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  }
}

function updateAdminStatus(userId, isAdmin) {
  const turnon = isAdmin === "true";
  apiCall(
    `user/admin`,
    "PUT",
    { userId, turnon },
    localStorage.getItem("token")
  )
    .then((response) => {
      if (response.error) {
        showError(response.error);
      } else {
        alert("User admin status updated successfully.");
        showUserProfile(userId); // Refresh user profile page to display updated information
      }
    })
    .catch((error) => {
      console.error("Error updating admin status:", error);
    });
}
