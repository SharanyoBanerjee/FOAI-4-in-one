document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navigation Logic ---
    const navButtons = document.querySelectorAll('.sidebar-btn');
    const viewSections = document.querySelectorAll('.view-section');

    for (let i = 0; i < navButtons.length; i++) {
        const btn = navButtons[i];
        
        btn.addEventListener('click', function() {
            // Remove active classes
            for (let j = 0; j < navButtons.length; j++) {
                navButtons[j].classList.remove('active');
            }
            for (let k = 0; k < viewSections.length; k++) {
                viewSections[k].classList.remove('active');
                viewSections[k].style.display = 'none';
            }

            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding view
            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            
            if (targetView) {
                targetView.style.display = 'block';
                // Trigger reflow for animation
                void targetView.offsetWidth;
                targetView.classList.add('active');
            }
        });
    }

    // --- 2. Dog Finder Logic ---
    const dogImg = document.getElementById('dog-img');
    const dogLoadingShim = document.getElementById('dog-img-loading');
    const dogBreedText = document.getElementById('dog-breed');
    const btnFetchDog = document.getElementById('btn-fetch-dog');
    const btnCopyDog = document.getElementById('btn-copy-dog');

    dogImg.onload = function() {
        dogImg.style.display = 'block';
        dogLoadingShim.style.display = 'none';
    };

    async function fetchRandomDog() {
        try {
            dogImg.style.display = 'none';
            dogLoadingShim.style.display = 'block';
            dogBreedText.textContent = "Fetching...";
            
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();
            const url = data.message;
            
            dogImg.src = url;

            // Extract breed from URL (4th element after split)
            const parts = url.split('/');
            const breedRaw = parts[4];
            
            if (breedRaw) {
                // Formatting 'hound-english' to 'Hound English'
                const words = breedRaw.split('-');
                let formattedName = '';
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    formattedName += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
                }
                dogBreedText.textContent = formattedName.trim();
            } else {
                dogBreedText.textContent = "Unknown Breed";
            }
        } catch (error) {
            console.error(error);
            dogBreedText.textContent = "API Error";
            dogLoadingShim.style.display = 'none';
        }
    }

    btnFetchDog.addEventListener('click', fetchRandomDog);

    btnCopyDog.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(dogImg.src);
            const originalText = btnCopyDog.innerHTML;
            
            btnCopyDog.innerHTML = `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
            btnCopyDog.style.borderColor = "var(--cyan)";
            btnCopyDog.style.color = "var(--cyan)";
            
            setTimeout(() => {
                btnCopyDog.innerHTML = originalText;
                btnCopyDog.style.borderColor = "";
                btnCopyDog.style.color = "";
            }, 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    });

    // --- 3. Random Joke Logic ---
    const textSetup = document.getElementById('joke-setup');
    const textPunchline = document.getElementById('joke-punchline');
    const btnFetchJoke = document.getElementById('btn-fetch-joke');
    const btnLike = document.getElementById('btn-like');
    const btnDislike = document.getElementById('btn-dislike');

    async function fetchRandomJoke() {
        try {
            textSetup.textContent = "Fetching joke...";
            textPunchline.textContent = "";
            
            // Reset votes
            btnLike.style.background = "";
            btnDislike.style.background = "";

            const response = await fetch('https://official-joke-api.appspot.com/random_joke', { cache: 'no-store' });
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();
            
            textSetup.textContent = data.setup;
            setTimeout(() => {
                textPunchline.textContent = data.punchline;
            }, 600); // Dramatic pause
            
        } catch (error) {
            console.error(error);
            textSetup.textContent = "Failed to load joke. Try again!";
        }
    }

    btnFetchJoke.addEventListener('click', fetchRandomJoke);

    btnLike.addEventListener('click', () => {
        btnLike.style.background = "rgba(0, 255, 100, 0.2)";
        btnDislike.style.background = "";
    });
    btnDislike.addEventListener('click', () => {
        btnDislike.style.background = "rgba(255, 50, 50, 0.2)";
        btnLike.style.background = "";
    });

    // --- 4. User ID Logic ---
    const userImg = document.getElementById('user-img');
    const userLoadingShim = document.getElementById('user-img-loading');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userLocation = document.getElementById('user-location');
    const btnFetchUser = document.getElementById('btn-fetch-user');

    userImg.onload = function() {
        userImg.style.display = 'block';
        userLoadingShim.style.display = 'none';
    };

    async function fetchRandomUser() {
        try {
            userImg.style.display = 'none';
            userLoadingShim.style.display = 'block';
            userName.textContent = "Fetching...";
            userEmail.textContent = "";
            userLocation.textContent = "";

            const response = await fetch('https://randomuser.me/api/');
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();
            const person = data.results[0];

            userImg.src = person.picture.large;
            userName.textContent = person.name.first + " " + person.name.last;
            userEmail.textContent = person.email;
            userLocation.textContent = person.location.city + ", " + person.location.country;

        } catch (error) {
            console.error(error);
            userName.textContent = "Identity Error";
            userLoadingShim.style.display = 'none';
        }
    }

    btnFetchUser.addEventListener('click', fetchRandomUser);

    // --- 5. User Comments Logic ---
    const commentsContainer = document.getElementById('comments-container');
    const btnFetchComments = document.getElementById('btn-fetch-comments');

    async function fetchComments() {
        try {
            commentsContainer.innerHTML = '<p class="text-muted">Loading threads...</p>';
            
            const response = await fetch('https://jsonplaceholder.typicode.com/comments');
            if (!response.ok) throw new Error("Network response was not ok");
            
            const comments = await response.json();
            commentsContainer.innerHTML = '';
            
            // Pick a random starting index from the 500 comments
            const maxIndex = Math.max(0, comments.length - 4);
            const startIndex = Math.floor(Math.random() * maxIndex);
            
            // Loop 4 random comments
            for (let i = startIndex; i < startIndex + 4; i++) {
                const comment = comments[i];
                
                if (!comment) break; // Safety check
                
                const card = document.createElement('div');
                card.className = 'comment-card';
                
                const nameNode = document.createElement('h4');
                nameNode.textContent = comment.name.substring(0, 30) + '...';
                
                const emailNode = document.createElement('span');
                emailNode.textContent = comment.email;
                
                const bodyNode = document.createElement('p');
                bodyNode.textContent = comment.body.substring(0, 100) + '...';
                
                card.appendChild(nameNode);
                card.appendChild(emailNode);
                card.appendChild(bodyNode);
                
                commentsContainer.appendChild(card);
            }
            
        } catch (error) {
            console.error(error);
            commentsContainer.innerHTML = '<p style="color:red">Failed to load comments</p>';
        }
    }

    btnFetchComments.addEventListener('click', fetchComments);

    // --- Bootstrapping initial loads ---
    fetchRandomDog();
    fetchRandomJoke();
    fetchRandomUser();
    fetchComments();
});
