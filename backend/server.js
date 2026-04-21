require('dotenv').config();

const app = require('./config/app');

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
