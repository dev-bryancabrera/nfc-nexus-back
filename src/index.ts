import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 NFC Cards API  →  http://localhost:${PORT}`);
  console.log(`🌐 Domain mode    →  ${process.env.DOMAIN_MODE || 'path'}`);
  console.log(`📡 Env            →  ${process.env.NODE_ENV}\n`);
});
