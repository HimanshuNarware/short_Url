/** @format */

import React, { useRef, useState } from 'react';
import './home.css';
import axios from 'axios';

function Home() {
  const [url, setUrls] = useState('');
  const [result, setResult] = useState('');
  const name = 'website';
  const ref = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    setUrls(ref.current.value);
    fetchApi();
  }

  const DefaultUrl = process.env.REACT_APP_BACKEND_URL;

  async function fetchApi() {
    try {
      const response = await axios.post(`${DefaultUrl}api/url/`, {
        url,
        name,
      });

      if (!response.data.message.nnid) return;

      console.log(response.data.message.nnid);
      setResult(DefaultUrl + '/' + response.data.message.nnid);
    } catch (e) {
      console.log('error in the request', e.message);
    }
  }

  return (
    <div className="Home">
      <h1 className="heading">URL Shortener</h1>
      <div className="container">
        <form action="">
          <label htmlFor="url">Paste the URL to be shortened</label>

          <input
            type="text"
            id="url"
            name="url"
            placeholder="Enter URL"
            ref={ref}
          />
          <input
            type="text"
            placeholder="result"
            value={result || ''}
  
          />
          {/* <p className='pera'>Click ! on shorten to get the result...</p> */}
          <button className="submit" onClick={handleSubmit}>
            Shorten
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
