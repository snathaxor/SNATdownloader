const express = require('express');
const axios = require('axios');
const cors = require('cors');
const qs = require('qs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const CLIENT_KEY = 'awh4nyb9tc6vp0c1';
const CLIENT_SECRET = 'z1bTZ6QWiG8EhAihDPLoUhjggG9jQKh6';

// Function to get an access token
async function getAccessToken() {
    const tokenUrl = 'https://open.tiktokapis.com/oauth/access_token/';
    const tokenData = {
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'portability.all.single, portability.all.ongoing, portability.activity.single, portability.activity.ongoing, portability.directmessages.single, portability.directmessages.ongoing, portability.postsandprofile.single, portability.postsandprofile.ongoing',
    };

    try {
        const response = await axios.post(tokenUrl, qs.stringify(tokenData), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw new Error('Failed to get access token');
    }
}

// Endpoint to download TikTok video
app.post('/api/download', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL is required' });
    }

    try {
        const accessToken = await getAccessToken();
        const downloadUrl = 'https://open.tiktokapis.com/v2/user/data/download/';

        const response = await axios.post(downloadUrl, { video_url: videoUrl }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            responseType: 'stream',
        });

        res.setHeader('Content-Disposition', 'attachment; filename=video.zip');
        response.data.pipe(res);
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
