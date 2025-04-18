/** @format */

import React, { useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './home.css';

function Home() {
  const [url, setUrls] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const name = 'website';
  const ref = useRef(null);

  const DefaultUrl = process.env.REACT_APP_BACKEND_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ref.current.value) {
      toast.error('Please enter a URL');
      return;
    }

    setUrls(ref.current.value);
    setIsLoading(true);

    try {
      const response = await axios.post(`${DefaultUrl}api/url/`, {
        url: ref.current.value,
        name,
      });

      if (!response.data.message.nnid) {
        toast.error('Invalid response from server');
        return;
      }

      const shortUrl = DefaultUrl + '/' + response.data.message.nnid;
      setResult(shortUrl);
      toast.success('URL shortened successfully!');
    } catch (e) {
      toast.error('Error shortening URL');
      console.error('Error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <h1 className="main-title">
          URL Shortener
        </h1>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="url-form">
            <div className="form-content">
              <label htmlFor="url" className="url-label">
                Paste the URL to be shortened
              </label>

              <div className="input-group">
                <input
                  type="url"
                  id="url"
                  ref={ref}
                  className="url-input"
                  placeholder="Enter URL"
                />

                <input
                  type="text"
                  readOnly
                  onClick={handleCopy}
                  className="result-input"
                  placeholder="Your shortened URL will appear here"
                  value={result || ''}
                  title={result ? 'Click to copy' : ''}
                />
              </div>

              <div className="button-container">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-button"
                >
                  {isLoading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Shorten'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
