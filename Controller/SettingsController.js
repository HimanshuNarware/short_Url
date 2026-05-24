const Profile = require('../Model/Profile');
const SystemSettings = require('../Model/SystemSettings');
const ApiKey = require('../Model/ApiKey');
const { success, error } = require('../Utils/ResponseWrapper');

const getProfileController = async (req, res) => {
    try {
        let profile = await Profile.findOne();
        if (!profile) {
            profile = await Profile.create({ name: 'Steve', level: 42, avatar: '👨‍🌾' });
        }
        return res.send(success(200, profile));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const updateProfileController = async (req, res) => {
    try {
        const { name, level, avatar } = req.body;
        let profile = await Profile.findOne();
        if (!profile) {
            profile = new Profile();
        }
        if (name !== undefined) profile.name = name;
        if (level !== undefined) profile.level = level;
        if (avatar !== undefined) profile.avatar = avatar;
        await profile.save();
        return res.send(success(200, profile));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const getSystemSettingsController = async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        return res.send(success(200, settings));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const updateSystemSettingsController = async (req, res) => {
    try {
        const { rateLimit, burstAllowance, smartThrottling, dnsChecks, malwareFiltering, deepAnalysis, resolutionReplicas, analyticsReplicas } = req.body;
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
        }
        if (rateLimit !== undefined) settings.rateLimit = rateLimit;
        if (burstAllowance !== undefined) settings.burstAllowance = burstAllowance;
        if (smartThrottling !== undefined) settings.smartThrottling = smartThrottling;
        if (dnsChecks !== undefined) settings.dnsChecks = dnsChecks;
        if (malwareFiltering !== undefined) settings.malwareFiltering = malwareFiltering;
        if (deepAnalysis !== undefined) settings.deepAnalysis = deepAnalysis;
        if (resolutionReplicas !== undefined) settings.resolutionReplicas = resolutionReplicas;
        if (analyticsReplicas !== undefined) settings.analyticsReplicas = analyticsReplicas;
        await settings.save();
        return res.send(success(200, settings));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const getApiKeysController = async (req, res) => {
    try {
        const keys = await ApiKey.find().sort({ createdAt: -1 });
        if (keys.length === 0) {
            const defaultKeys = [
                { name: 'Mobile_Prod_App', key: 'xk92', lastUsed: '2 min ago', status: 'ACTIVE' },
                { name: 'Staging_Local', key: '99ar', lastUsed: '--', status: 'REVOKED' },
            ];
            const inserted = await ApiKey.insertMany(defaultKeys);
            return res.send(success(200, inserted));
        }
        return res.send(success(200, keys));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const createApiKeyController = async (req, res) => {
    try {
        const { name, key } = req.body;
        if (!name) {
            return res.send(error(400, 'Name is required'));
        }
        const generatedKey = key || Math.random().toString(36).substring(2, 6);
        const newKey = await ApiKey.create({
            name,
            key: generatedKey,
            status: 'ACTIVE'
        });
        return res.send(success(200, newKey));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const deleteApiKeyController = async (req, res) => {
    try {
        const { id } = req.params;
        await ApiKey.findByIdAndDelete(id);
        return res.send(success(200, 'API key deleted successfully'));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

module.exports = {
    getProfileController,
    updateProfileController,
    getSystemSettingsController,
    updateSystemSettingsController,
    getApiKeysController,
    createApiKeyController,
    deleteApiKeyController
};
