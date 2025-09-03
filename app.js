const moviesGrid = document.getElementById("moviesGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

// Login
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const loginBtn = document.getElementById("loginBtn");
let currentUser = localStorage.getItem("najpickUser") || null;

if(!currentUser) loginModal.style.display = "flex";
closeModal.onclick = () => loginModal.style.display = "none";
loginBtn.onclick = () => {
  const username = document.getElementById("username").value.trim();
  if(username){
    currentUser = username;
    localStorage.setItem("najpickUser", username);
    loginModal.style.display = "none";
    alert(`Welcome, ${currentUser}!`);
    renderMovies(movies);
  }
};

// Render movies
function renderMovies(list){
  moviesGrid.innerHTML = "";
  if(list.length === 0){
    moviesGrid.innerHTML = "<p style='text-align:center;'>No movies found.</p>";
    return;
  }

  list.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const reviews = JSON.parse(localStorage.getItem(`reviews_${movie.title}`)) || [];
    const userReviewHTML = reviews.map(r=>`<p><strong>${r.user}:</strong> ${r.text}</p>`).join("");

    const reviewSection = currentUser ? `
      <div class="review-section">
        <input type="text" placeholder="Write a review" class="reviewInput">
        <button class="submitReviewBtn">Submit</button>
        <div class="userReviews">${userReviewHTML}</div>
      </div>` :
      `<div class="userReviews">${userReviewHTML}</div>`;

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.rating}</p>
      <p>${movie.review}</p>
      ${reviewSection}
    `;

    moviesGrid.appendChild(card);

    if(currentUser){
      const submitBtn = card.querySelector(".submitReviewBtn");
      const input = card.querySelector(".reviewInput");
      const userReviewsDiv = card.querySelector(".userReviews");

      submitBtn.addEventListener("click", () => {
        const text = input.value.trim();
        if(text){
          const newReview = {user: currentUser, text};
          reviews.push(newReview);
          localStorage.setItem(`reviews_${movie.title}`, JSON.stringify(reviews));
          userReviewsDiv.innerHTML = reviews.map(r=>`<p><strong>${r.user}:</strong> ${r.text}</p>`).join("");
          input.value = "";
        }
      });
    }
  });
}

// Initial render
renderMovies(movies);

// Dark/Light toggle
toggleThemeBtn.addEventListener("click", ()=>{
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light")?"light":"dark");
});
if(localStorage.getItem("theme")==="light") document.body.classList.add("light");

// Search function
function searchMovies(){
  const term = searchInput.value.toLowerCase().trim();
  const filtered = movies.filter(m=>m.title.toLowerCase().includes(term));
  renderMovies(filtered);
}
searchBtn.addEventListener("click", searchMovies);
searchInput.addEventListener("keypress", e=>{
  if(e.key==="Enter"){ e.preventDefault(); searchMovies(); }
});
