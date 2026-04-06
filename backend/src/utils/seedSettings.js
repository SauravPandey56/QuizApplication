import SystemSetting from '../models/SystemSetting.js';

const seedSettings = async () => {
  try {
    const defaultSettings = [
      { type: 'campus', value: 'GEU DEHRADUN' },
      { type: 'campus', value: 'GEHU DEHRADUN' },
      { type: 'campus', value: 'GEHU haldwani' },
      { type: 'campus', value: 'GEHU bihmtal' },
      { type: 'branch', value: 'CSE' },
      { type: 'branch', value: 'mechinical' },
      { type: 'branch', value: 'civil' },
      { type: 'branch', value: 'electrical' },
      { type: 'branch', value: 'ECE' },
      { type: 'branch', value: 'chemical' },
      { type: 'semester', value: '1' },
      { type: 'semester', value: '2' },
      { type: 'semester', value: '3' },
      { type: 'semester', value: '4' },
      { type: 'semester', value: '5' },
      { type: 'semester', value: '6' },
      { type: 'semester', value: '7' },
      { type: 'semester', value: '8' },
      { type: 'section', value: 'A' },
      { type: 'section', value: 'B' },
      { type: 'section', value: 'C' },
      { type: 'section', value: 'D' },
    ];

    for (const setting of defaultSettings) {
      await SystemSetting.findOneAndUpdate(
        { type: setting.type, value: setting.value },
        setting,
        { upsert: true }
      );
    }
    console.log('System settings seeded!');
  } catch (error) {
    console.error('Error seeding settings:', error);
  }
};

export default seedSettings;
