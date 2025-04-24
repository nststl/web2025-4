const { program } = require('commander');
const fs = require('fs');
const fsAsync = require('fs/promises');
const http = require('http');
const { XMLBuilder } = require('fast-xml-parser'); 
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

if (!options.host || !options.port || !options.input) {
  console.error('Missing required parameters');
  process.exit(1);
}

const requestListener = function (req, res) {
  fsAsync.readFile(options.input, 'utf-8')
    .then(function (fileContent) {
      const jsonData = JSON.parse(fileContent);

      const filtered = jsonData.filter(function (item, index) {
        return index < 13 && item.value > 5;
      });

      const xmlData = {
        data: {
          value: filtered.map(function (v) {
            return v.value;
          })
        }
      };

      const builder = new XMLBuilder(); 
      const xmlString = builder.build(xmlData); 

      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(xmlString);
    })
    .catch(function (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error: ' + error.message);
    });
};

const server = http.createServer(requestListener);
server.listen(options.port, options.host, function () {
  console.log(`Server is running on http://${options.host}:${options.port}`);
});
