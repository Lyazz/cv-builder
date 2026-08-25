const app = require('./lib/app');

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`CV Builder démarré → http://localhost:${PORT}`);
});
