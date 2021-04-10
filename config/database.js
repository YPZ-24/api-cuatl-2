module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        uri: env('DATABASE_URI', 'mongodb+srv://cuatl:AvtW2INoBXoflp8m@cluster0.72xs3.mongodb.net/strapi?retryWrites=true&w=majority'),
      },
      options: {
        ssl: true,
      },
    },
  },
});