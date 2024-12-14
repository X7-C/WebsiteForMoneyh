document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "placeBidButton" && !token) {
        e.preventDefault();
        showLoginPopup();
      }
    });
  });
  
  function showLoginPopup() {
    if (document.querySelector("#loginPopup")) return;
    const popupContainer = document.createElement("div");
    popupContainer.id = "loginPopup";
    popupContainer.classList.add("popup-overlay");
  
    popupContainer.innerHTML = `
      <div class="popup-content animate-slide-down">
        <h2 class="popup-title">Login Required</h2>
        <p>You must be logged in to place a bid.</p>
        <a href="../../pages/login/index.html" class="btn btn-primary">Go to Login</a>
        <button id="closePopup" class="btn btn-secondary mt-3">Close</button>
      </div>
    `;
    document.body.appendChild(popupContainer);
    document.querySelector("#closePopup").addEventListener("click", () => {
      popupContainer.remove();
    });
  }
  