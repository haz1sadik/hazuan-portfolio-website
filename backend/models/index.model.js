import sequelize from '../configs/database.js';
import Admin from './Admin.model.js';
import Blog from './Blog.model.js';
import Guide from './Guide.model.js';
import CTFWriteup from './CTFWriteup.model.js';
import CTFEvent from './CTFEvent.model.js';
import Image from './Image.model.js';

// Define Associations
Admin.hasMany(Blog);
Blog.belongsTo(Admin);

Admin.hasMany(Guide);
Guide.belongsTo(Admin);

Admin.hasMany(CTFWriteup);
CTFWriteup.belongsTo(Admin);

CTFEvent.hasMany(CTFWriteup, { foreignKey: 'event_id' });
CTFWriteup.belongsTo(CTFEvent, { foreignKey: 'event_id' });

export {
  sequelize,
  Admin,
  Blog,
  Guide,
  CTFWriteup,
  CTFEvent,
  Image
};
