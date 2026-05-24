const Url = require("../Model/Url");
const Analytics = require("../Model/Analytics");
const { success, error } = require("../Utils/ResponseWrapper");
const { nanoid } = require('nanoid');

const getUrlShortnerController = async (req, res) => {
  try {
    const nnid = nanoid(8);
    const { url, name } = req.body;
    if (!url) {
      return res.send(error(401, 'URL is required'));
    }
    const result = await Url.create({
      url,
      name: name || 'website',
      nnid,
      clicks: 0,
      clicksHistory: [],
      userId: req.user ? req.user.id : null
    });
    return res.send(success(200, result));
  } catch (e) {
    return res.send(error(500, e.message));
  }
}

const getOriginalUrlController = async (req, res) => {
  try {
    const nnid = req.params.id;
    if (!nnid) {
      return res.send(error(401, 'Invalid url'));
    }
    const urlDoc = await Url.findOne({ nnid });
    if (!urlDoc) {
      return res.send(error(404, 'Url not found'));
    }

    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const referer = req.headers['referer'] || req.headers['referrer'] || '';

    // Device parser
    let deviceType = 'Desktop';
    if (/mobile/i.test(userAgent)) deviceType = 'Mobile';
    else if (/tablet|ipad/i.test(userAgent)) deviceType = 'Tablet';
    else if (/console|nintendo|playstation|xbox/i.test(userAgent)) deviceType = 'Misc';

    // Referrer parser
    let referrerSource = 'Direct Connect';
    if (/google|bing|yahoo|baidu/i.test(referer)) referrerSource = 'Search Explorers';
    else if (/facebook|twitter|instagram|reddit|linkedin|t\.co/i.test(referer)) referrerSource = 'Social Spawners';

    // Country via IP
    const countries = ['United Realms', 'Euro-Spawners', 'Asian Biomes'];
    let countryIdx = 0;
    if (ip) {
      let sum = 0;
      for (let i = 0; i < ip.length; i++) sum += ip.charCodeAt(i);
      countryIdx = sum % countries.length;
    }
    const country = countries[countryIdx];

    urlDoc.clicks = (urlDoc.clicks || 0) + 1;
    urlDoc.clicksHistory.push({ userAgent, deviceType, country, referrer: referrerSource, ip });
    await urlDoc.save();

    await Analytics.create({
      urlId: urlDoc._id,
      nnid: urlDoc.nnid,
      userAgent,
      deviceType,
      country,
      referrer: referrerSource,
      ip
    });

    return res.redirect(urlDoc.url);
  } catch (e) {
    return res.send(error(500, e.message));
  }
}

const getRecentUrlsController = async (req, res) => {
  try {
    // If logged in: show only this user's URLs. Otherwise show all public (no-user) URLs.
    const query = req.user ? { userId: req.user.id } : { userId: null };
    const urls = await Url.find(query).sort({ createdAt: -1 }).limit(50);
    return res.send(success(200, urls));
  } catch (e) {
    return res.send(error(500, e.message));
  }
}

const deleteUrlController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Url.findOneAndDelete({ nnid: id, userId: req.user.id });
    if (!deleted) {
      return res.send(error(404, 'URL not found or unauthorized'));
    }
    return res.send(success(200, 'URL deleted successfully'));
  } catch (e) {
    return res.send(error(500, e.message));
  }
}

const getGlobalStatsController = async (req, res) => {
  try {
    const query = req.user ? { userId: req.user.id } : { userId: null };
    const urls = await Url.find(query);
    let totalClicks = 0;
    let uniqueIps = new Set();

    let devices = { Desktop: 0, Mobile: 0, Tablet: 0, Misc: 0 };
    let biomes = { 'United Realms': 0, 'Euro-Spawners': 0, 'Asian Biomes': 0 };
    let referrers = { 'Direct Connect': 0, 'Social Spawners': 0, 'Search Explorers': 0 };
    let dailyClicks = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0 };

    urls.forEach(url => {
      totalClicks += url.clicks || 0;
      (url.clicksHistory || []).forEach(history => {
        if (history.ip) uniqueIps.add(history.ip);

        const dev = history.deviceType || 'Desktop';
        if (devices[dev] !== undefined) devices[dev]++;

        const biome = history.country || 'United Realms';
        if (biomes[biome] !== undefined) biomes[biome]++;

        const ref = history.referrer || 'Direct Connect';
        if (referrers[ref] !== undefined) referrers[ref]++;

        if (history.timestamp) {
          const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
          const dayName = days[new Date(history.timestamp).getDay()];
          if (dailyClicks[dayName] !== undefined) dailyClicks[dayName]++;
        }
      });
    });

    return res.send(success(200, {
      totalClicks,
      uniquePlayers: uniqueIps.size,
      totalUrls: urls.length,
      devices,
      biomes,
      referrers,
      dailyClicks
    }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
}

module.exports = {
  getUrlShortnerController,
  getOriginalUrlController,
  getRecentUrlsController,
  deleteUrlController,
  getGlobalStatsController
}