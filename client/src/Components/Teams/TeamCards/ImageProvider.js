export const TeamBanner = (teamID) => {
    const teamImages = {
        'CSK': 'https://wallpapercave.com/wp/wp9765327.jpg',
        'MI': 'https://wallpapercave.com/wp/wp5040444.jpg',
        'RCB': 'https://wallpapercave.com/wp/wp4248217.png',
        'KKR': 'https://wallpapercave.com/wp/wp2850085.jpg',
        'SRH': 'https://wallpapercave.com/wp/wp4166531.jpg',
        'DC': 'https://wallpapercave.com/wp/wp6916588.jpg',
        'RR': 'https://wallpapercave.com/wp/wp8765874.jpg',
        'PK': 'image-source-for-pkbs',
        'GT': 'https://wallpapercave.com/wp/wp11060384.jpg',
    };

    return teamImages[teamID] || 'default-image-source';
};
