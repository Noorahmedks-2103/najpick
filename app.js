let currentIndex = 0;
let currentUser = null;
const reviewsDB = {};
const moviesGrid = document.getElementById("moviesGrid");
const toggleThemeBtn = document.getElementById("toggleTheme");

// Dark/light toggle
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
});
if(localStorage.getItem("theme")==="light") document.body.classList.add("light");

// Render movie grid
function renderGrid() {
  moviesGrid.innerHTML="";
  movies.forEach((movie, index)=>{
    const card = document.createElement("div");
    card.className="movie-card";
    card.innerHTML=`
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
    `;
    card.addEventListener("click",()=>openModal(movie,index));
    moviesGrid.appendChild(card);
  });
}
renderGrid();

// Open modal
function openModal(movie,index){
  currentIndex=index;
  document.getElementById("modalTitle").textContent=movie.title;
  document.getElementById("modalRating").textContent=`⭐ ${movie.vote_average}`;
  document.getElementById("modalOverview").textContent=movie.overview;

  fetchTrailer(movie.id);
  renderReviews(currentIndex);
  document.getElementById("movieModal").style.display="flex";
}

// Fetch trailer (poster fallback)
function fetchTrailer(movieId){
  const movie=movies.find(m=>m.id===movieId);
  const trailerContainer=document.getElementById("trailerContainer");
  trailerContainer.innerHTML=`<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" style="width:100%;border-radius:8px;">`;
}

// Close modal
document.querySelector(".close-btn").addEventListener("click",()=>{
  document.getElementById("movieModal").style.display="none";
  document.getElementById("trailerContainer").innerHTML="";
});

// Navigation arrows
document.querySelector(".left-arrow").addEventListener("click",()=>openModal(movies[(currentIndex-1+movies.length)%movies.length],(currentIndex-1+movies.length)%movies.length));
document.querySelector(".right-arrow").addEventListener("click",()=>openModal(movies[(currentIndex+1)%movies.length],(currentIndex+1)%movies.length));

// Keyboard support
document.addEventListener("keydown",(e)=>{
  if(document.getElementById("movieModal").style.display==="flex"){
    if(e.key==="ArrowRight") openModal(movies[(currentIndex+1)%movies.length],(currentIndex+1)%movies.length);
    if(e.key==="ArrowLeft") openModal(movies[(currentIndex-1+movies.length)%movies.length],(currentIndex-1+movies.length)%movies.length);
    if(e.key==="Escape"){document.getElementById("movieModal").style.display="none";document.getElementById("trailerContainer").innerHTML="";}
  }
});

// Login & Reviews
document.getElementById("loginBtn").addEventListener("click",()=>{
  const name=document.getElementById("username").value.trim();
  if(name){currentUser=name;document.getElementById("loginForm").style.display="none";document.getElementById("reviewForm").style.display="block";}
});

document.getElementById("submitReview").addEventListener("click",()=>{
  if(!currentUser)return alert("Please login first");
  const reviewText=document.getElementById("reviewText").value.trim();
  const reviewRating=document.getElementById("reviewRating").value;
  if(!reviewText||!reviewRating)return alert("Please write review and rating");
  if(!reviewsDB[currentIndex])reviewsDB[currentIndex]=[];
  reviewsDB[currentIndex].push({user:currentUser,text:reviewText,rating:reviewRating});
  document.getElementById("reviewText").value="";document.getElementById("reviewRating").value="";
  renderReviews(currentIndex);
});

function renderReviews(index){
  const list=document.getElementById("reviewsList");list.innerHTML="";
  if(!reviewsDB[index]||reviewsDB[index].length===0){list.innerHTML="<li>No reviews yet.</li>";return;}
  reviewsDB[index].forEach(r=>{const li=document.createElement("li");li.innerHTML=`<strong>${r.user}</strong>: ${r.text} (⭐ ${r.rating})`;list.appendChild(li);});
}
