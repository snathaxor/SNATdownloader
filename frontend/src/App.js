import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState('');

    const handleDownload = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/download', { videoUrl }, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'video.zip');
            document.body.appendChild(link);
            link.click();

            setError('');
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to download video');
        }
    };

    return (
        <div className="App">
            <h1>TikTok Video Downloader</h1>
            <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter TikTok video URL"
            />
            <button onClick={handleDownload}>Download</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default App;
