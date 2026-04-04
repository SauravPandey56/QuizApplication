import SystemSetting from '../models/SystemSetting.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.find({ isActive: true });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSetting = async (req, res) => {
  try {
    const { type, value } = req.body;
    const settingExists = await SystemSetting.findOne({ type, value });
    
    if (settingExists) {
      if (!settingExists.isActive) {
        settingExists.isActive = true;
        await settingExists.save();
        return res.status(200).json(settingExists);
      }
      return res.status(400).json({ message: 'Setting already exists' });
    }

    const setting = await SystemSetting.create({ type, value });
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSetting = async (req, res) => {
  try {
    const setting = await SystemSetting.findById(req.params.id);
    if (!setting) return res.status(404).json({ message: 'Setting not found' });
    
    // We can either delete or just deactivate
    await SystemSetting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Setting removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
