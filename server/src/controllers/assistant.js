const createError = require('http-errors');
const { askAssistant, getProfileData } = require('../services/assistant.service');

exports.chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return next(createError(400, 'Message query is required'));
    }

    const result = await askAssistant(message, history);

    return res.status(200).json({
      success: true,
      answer: result.answer,
      source: result.source,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = (req, res, next) => {
  try {
    const profile = getProfileData();
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

