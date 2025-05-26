  function playVideo(videoId) {
    const iframe = document.getElementById('youtube-player');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    document.getElementById('video-container').style.display = 'block';
}


        // Sample trick database
        const tricks = [
            { name: "Kickflip", description: "Classic flip trick - pop, flick, catch, roll away" },
            { name: "Heelflip", description: "Flip with your heel - opposite of kickflip" },
            { name: "Tre Flip", description: "360 flip - kickflip with a 360 shuvit" },
            { name: "Hardflip", description: "Frontside pop shuvit with a kickflip" },
            { name: "Varial Flip", description: "Backside pop shuvit with a kickflip" },
            { name: "Inward Heelflip", description: "Backside pop shuvit with a heelflip" },
            { name: "Laser Flip", description: "360 frontside pop shuvit with a heelflip" },
            { name: "Impossible", description: "Board wraps around your back foot" },
            { name: "360 Flip", description: "Board does a full 360 while flipping" },
            { name: "Casper Flip", description: "Half kickflip to casper, then flip out" }
        ];

        // Previous tricks data
        const previousTricks = [
            { date: "Dec 29, 2024", trick: "Tre Flip", submissions: 15 },
            { date: "Dec 22, 2024", trick: "Hardflip", submissions: 12 },
            { date: "Dec 15, 2024", trick: "Varial Flip", submissions: 18 },
            { date: "Dec 8, 2024", trick: "Heelflip", submissions: 22 },
            { date: "Dec 1, 2024", trick: "Impossible", submissions: 8 }
        ];

        // Current submissions (in memory only)
        let currentSubmissions = [];

        function isFriday() {
            return new Date().getDay() === 5;
        }

        function getDaysUntilFriday() {
            const today = new Date().getDay();
            if (today === 5) return 0;
            return today < 5 ? 5 - today : 7 - today + 5;
        }

        function getTodaysTrick() {
            // Use current date as seed for consistent daily trick
            const today = new Date();
            const dateString = today.toDateString();
            let hash = 0;
            for (let i = 0; i < dateString.length; i++) {
                const char = dateString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return tricks[Math.abs(hash) % tricks.length];
        }

        function updateDisplay() {
            const dayIndicator = document.getElementById('dayIndicator');
            const fridayContent = document.getElementById('fridayContent');
            const waitContent = document.getElementById('waitContent');
            const submissions = document.getElementById('submissions');
            
            if (isFriday()) {
                const todaysTrick = getTodaysTrick();
                
                dayIndicator.innerHTML = '🛹 IT\'S FRIDAY! 🛹';
                dayIndicator.style.background = 'linear-gradient(45deg, #ff6b35, #f7931e)';
                
                document.getElementById('trickName').textContent = todaysTrick.name;
                document.getElementById('trickDescription').textContent = todaysTrick.description;
                
                fridayContent.style.display = 'block';
                waitContent.style.display = 'none';
                submissions.style.display = 'block';
            } else {
                const daysUntil = getDaysUntilFriday();
                dayIndicator.innerHTML = `${daysUntil} day${daysUntil === 1 ? '' : 's'} until Friday`;
                
                fridayContent.style.display = 'none';
                waitContent.style.display = 'block';
                submissions.style.display = 'none';
                
                updateCountdown();
            }
        }

        function updateCountdown() {
            const now = new Date();
            const nextFriday = new Date();
            const daysUntil = getDaysUntilFriday();
            
            nextFriday.setDate(now.getDate() + daysUntil);
            nextFriday.setHours(0, 0, 0, 0);
            
            const timeUntil = nextFriday - now;
            const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('countdown').textContent = 
                `${days}d ${hours}h ${minutes}m`;
        }

        function populateTrickHistory() {
            const historyContainer = document.getElementById('trickHistory');
            historyContainer.innerHTML = '';
            
            previousTricks.forEach(trick => {
                const card = document.createElement('div');
                card.className = 'history-card';
                card.innerHTML = `
                    <div class="history-date">${trick.date}</div>
                    <div class="history-trick">${trick.trick}</div>
                    <div>${trick.submissions} submissions</div>
                `;
                historyContainer.appendChild(card);
            });
        }

        function submitVideo() {
            const fileInput = document.getElementById('videoUpload');
            const userName = document.getElementById('userName').value || 'Anonymous';
            
            if (!fileInput.files[0]) {
                alert('Please select a video file first!');
                return;
            }
            
            // Simulate submission
            const submission = {
                name: userName,
                fileName: fileInput.files[0].name,
                time: new Date().toLocaleTimeString()
            };
            
            currentSubmissions.push(submission);
            displaySubmissions();
            
            // Clear form
            fileInput.value = '';
            document.getElementById('userName').value = '';
            
            alert('Video submitted! Thanks for the first try attempt! 🛹');
        }

        function displaySubmissions() {
            const submissionsList = document.getElementById('submissionsList');
            submissionsList.innerHTML = '';
            
            currentSubmissions.forEach(submission => {
                const item = document.createElement('div');
                item.className = 'submission-item';
                item.innerHTML = `
                    <strong>${submission.name}</strong> submitted at ${submission.time}
                    <br><small>File: ${submission.fileName}</small>
                `;
                submissionsList.appendChild(item);
            });
        }

        // Initialize app
        updateDisplay();
        populateTrickHistory();
        
        // Update countdown every minute
        setInterval(() => {
            if (!isFriday()) {
                updateCountdown();
            }
        }, 60000);

        // Check for day change every hour
        setInterval(updateDisplay, 3600000);

        // Navigation functions
        function showHome() {
            document.getElementById('dayIndicator').parentElement.style.display = 'block';
            document.getElementById('fridayContent').style.display = isFriday() ? 'block' : 'none';
            document.getElementById('waitContent').style.display = isFriday() ? 'none' : 'block';
            document.getElementById('submissions').style.display = isFriday() ? 'block' : 'none';
            document.querySelector('.previous-tricks').style.display = 'block';
            document.getElementById('aboutSection').style.display = 'none';
            
            document.getElementById('homeBtn').classList.add('active');
            document.getElementById('aboutBtn').classList.remove('active');
        }

        function showAbout() {
            document.getElementById('dayIndicator').parentElement.style.display = 'none';
            document.getElementById('fridayContent').style.display = 'none';
            document.getElementById('waitContent').style.display = 'none';
            document.getElementById('submissions').style.display = 'none';
            document.querySelector('.previous-tricks').style.display = 'none';
            document.getElementById('aboutSection').style.display = 'block';
            
            document.getElementById('homeBtn').classList.remove('active');
            document.getElementById('aboutBtn').classList.add('active');
        }

        function show() {
            document.getElementById('dayIndicator').parentElement.style.display = 'none';
            document.getElementById('fridayContent').style.display = 'none';
            document.getElementById('waitContent').style.display = 'none';
            document.getElementById('submissions').style.display = 'none';
            document.querySelector('.previous-tricks').style.display = 'none';
            document.getElementById('aboutSection').style.display = 'block';
            
            document.getElementById('homeBtn').classList.remove('active');
            document.getElementById('aboutBtn').classList.add('active');
        }
