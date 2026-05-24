const geoip = require('geoip-lite');

/**
 * Geo-location middleware
 * Captures client IP and attaches geo data to req.analytics
 */
const getClientLocationDetails = async (req, res, next) => {
    // Extract real client IP
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientIp = rawIp ? rawIp.split(',')[0].trim() : null;

    // Mock IP for local testing
    const ipToLookup = (clientIp === '::1' || clientIp === '127.0.0.1')
        ? '207.97.227.239'
        : clientIp;

    const geo = geoip.lookup(ipToLookup);

    req.analytics = {
        ip: clientIp,
        country: geo ? geo.country : 'Unknown',
        region: geo ? geo.region : 'Unknown',
        city: geo ? geo.city : 'Unknown',
        timezone: geo ? geo.timezone : 'Unknown',
        ll: geo ? geo.ll : [0, 0]
    };

    next();
};

module.exports = getClientLocationDetails;