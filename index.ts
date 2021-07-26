import express from 'express';
const app = express();
const PORT = 3000;

app.get('/', (_req,res) => res.send('Hello World'));

app.listen(PORT, () => {
  console.log(`Microsservice is running at https://localhost:${PORT}`);
});