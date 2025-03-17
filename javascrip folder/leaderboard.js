document.addEventListener('DOMContentLoaded', async () => {
    const leaderboardContainer = document.getElementById('leaderboardData');
    const badgesContainer = document.querySelector('.badges');

    const loggedInUsername = "testuser"; // Replace with the actual logged-in username
    let loggedInUserData = null;

    try {
        const userResponse = await fetch(`/user-data?username=${loggedInUsername}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        loggedInUserData = await userResponse.json();
    } catch (err) {
        console.error('Error fetching user data:', err);
    }

    try {
        const leaderboardResponse = await fetch('/leaderboard');
        if (!leaderboardResponse.ok) throw new Error('Failed to fetch leaderboard data');
        const leaderboardData = await leaderboardResponse.json();

        leaderboardData.forEach((player, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.score}</td>
                <td>${player.levelsCompleted || 'N/A'}</td>
                <td>${player.accuracy || 'N/A'}%</td>
                <td>${player.badges?.join(', ') || 'No badges yet'}</td>
            `;
            leaderboardContainer.appendChild(tr);
        });

        if (loggedInUserData && !leaderboardData.some(player => player.username === loggedInUserData.username)) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${leaderboardData.length + 1}</td>
                <td>${loggedInUserData.username}</td>
                <td>${loggedInUserData.score}</td>
                <td>${loggedInUserData.levelsCompleted || 'N/A'}</td>
                <td>${loggedInUserData.accuracy || 'N/A'}%</td>
                <td>${loggedInUserData.badges?.join(', ') || 'No badges yet'}</td>
            `;
            leaderboardContainer.appendChild(tr);
        }
    } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        leaderboardContainer.innerHTML = `<tr><td colspan="6">Failed to load leaderboard. Please try again later.</td></tr>`;
    }

    if (loggedInUserData) {
        const badges = [
            { title: "🏆 Quiz Master", description: "Awarded for completing all 50 levels of the quiz game.", earned: loggedInUserData.levelsCompleted >= 50 },
            { title: "✅ Beginner Challenger", description: "Awarded for completing all beginner levels.", earned: loggedInUserData.levelsCompleted >= 10 },
            { title: "🔥 Intermediate Pro", description: "Earned for completing all intermediate levels.", earned: loggedInUserData.levelsCompleted >= 25 },
            { title: "📢 Social Sharer", description: "Earned by sharing your leaderboard position on social media.", earned: loggedInUserData.sharedOnSocialMedia },
            { title: "🎯 Accuracy Master", description: "Awarded for maintaining an accuracy rate of 90% or higher.", earned: loggedInUserData.accuracy >= 90 },
        ];

        badges.forEach(badge => {
            const badgeDiv = document.createElement('div');
            badgeDiv.classList.add('badge');
            badgeDiv.innerHTML = `
                <h3>${badge.title}</h3>
                <p>${badge.description}</p>
                <small>${badge.earned ? '✅ Earned' : '❌ Not Earned'}</small>
            `;
            badgesContainer.appendChild(badgeDiv);
        });
    }
});

// Share function for social media platforms
function share(platform) {
    const shareUrl = window.location.href; // URL of the current page
    let shareMessage = "Check out my score on Guhuza Game! 🎮";

    let shareLink = "";

    switch (platform) {
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`;
            break;
        case 'linkedin':
            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
            break;
        default:
            console.error('Invalid platform');
            return;
    }

    // Open the share link in a new window
    const shareWindow = window.open(shareLink, '_blank');

    // Check if the window was successfully opened
    if (shareWindow) {
        shareWindow.focus();
        alert(`You have successfully shared the link on ${platform}! 🎉`);
    } else {
        alert(`Failed to open ${platform}. Please allow pop-ups for this site.`);
    }
}