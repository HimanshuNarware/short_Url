const Profile = require('../Model/Profile');
const SystemSettings = require('../Model/SystemSettings');
const { success, error } = require('../Utils/ResponseWrapper');

const getProfileController = async (req, res) => {
    try {
        const query = req.user ? { userId: req.user.id } : { userId: null };
        let profile = await Profile.findOne(query);
        if (!profile) {
            profile = await Profile.create({
                userId: req.user ? req.user.id : null,
                name: req.user ? req.user.username : 'Crafter',
                level: 1,
                avatar: '👨‍🌾'
            });
        }
        return res.send(success(200, profile));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const updateProfileController = async (req, res) => {
    try {
        const { name, level, avatar } = req.body;
        const query = req.user ? { userId: req.user.id } : { userId: null };
        let profile = await Profile.findOne(query);
        if (!profile) {
            profile = new Profile({ userId: req.user ? req.user.id : null });
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
        const query = req.user ? { userId: req.user.id } : { userId: null };
        let settings = await SystemSettings.findOne(query);
        if (!settings) {
            settings = await SystemSettings.create({ userId: req.user ? req.user.id : null });
        }
        return res.send(success(200, settings));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const updateSystemSettingsController = async (req, res) => {
    try {
        const {
            rateLimit, burstAllowance, smartThrottling,
            dnsChecks, malwareFiltering, deepAnalysis,
            resolutionReplicas, analyticsReplicas
        } = req.body;
        const query = req.user ? { userId: req.user.id } : { userId: null };
        let settings = await SystemSettings.findOne(query);
        if (!settings) {
            settings = new SystemSettings({ userId: req.user ? req.user.id : null });
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

module.exports = {
    getProfileController,
    updateProfileController,
    getSystemSettingsController,
    updateSystemSettingsController,
};
