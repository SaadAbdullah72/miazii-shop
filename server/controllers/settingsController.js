import asyncHandler from 'express-async-handler';
import StoreSettings from '../models/storeSettingsModel.js';

// @desc    Get store settings (public — for payment info etc.)
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    // Always return a single settings doc; create with defaults if none exists
    let settings = await StoreSettings.findOne({});
    if (!settings) {
        settings = await StoreSettings.create({});
    }
    res.status(200).json(settings);
});

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    const {
        paymentPersonalNumber,
        paymentAgentNumber,
        paymentAgentLabel,
        paymentAgentNote,
        paymentVerificationTime,
        storeName,
        supportEmail,
        supportPhone,
    } = req.body;

    // Upsert — create if not exists, update if exists
    const settings = await StoreSettings.findOneAndUpdate(
        {}, // empty filter = match the singleton doc
        {
            ...(paymentPersonalNumber !== undefined && { paymentPersonalNumber }),
            ...(paymentAgentNumber !== undefined && { paymentAgentNumber }),
            ...(paymentAgentLabel !== undefined && { paymentAgentLabel }),
            ...(paymentAgentNote !== undefined && { paymentAgentNote }),
            ...(paymentVerificationTime !== undefined && { paymentVerificationTime }),
            ...(storeName !== undefined && { storeName }),
            ...(supportEmail !== undefined && { supportEmail }),
            ...(supportPhone !== undefined && { supportPhone }),
        },
        {
            new: true,       // return updated doc
            upsert: true,    // create if not exists
            setDefaultsOnInsert: true,
        }
    );

    res.status(200).json(settings);
});

export { getSettings, updateSettings };
