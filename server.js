const { program } = require('commander');
const fs = require('fs');
const http = require('http');
const host = 'localhost';
const port = 8000;  

program
  .option('-h, --host <host>', 'адреса сервера')
  .option('-p, --port <port>', 'порт сервера')
  .option('-i, --input <path>', 'шлях до файлу')
  .parse(process.argv);

const options = program.opts();

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

let jsonData;
try {
  const fileContent = fs.readFileSync(options.input, 'utf-8');
  jsonData = JSON.parse(fileContent);
} catch (error) {
  console.error('Error reading or parsing input file:', error.message);
  process.exit(1);
}

const requestListener = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(jsonData));
};

const server = http.createServer(requestListener);
server.listen(options.port, options.host, function () {
  console.log(`Server is running on http://${options.host}:${options.port}`);
});
