// Basic node example that prints document metadata and text content.
// Requires single file built version of PDF.js -- please run
// `node make singlefile` before running the example.
//

var fs = require('fs');

// HACK few hacks to let PDF.js be loaded not as a module in global space.
global.window = global;
global.navigator = { userAgent: "node" };
global.PDFJS = {};
global.DOMParser = require('./domparsermock.js').DOMParserMock;
require('./pdf.combined.js');

PDFJS.verbosity = PDFJS.VERBOSITY_LEVELS.errors;

// Loading file from file system into typed array
var pdfPath = process.argv[2] || './JSJ00.pdf';
var data = new Uint8Array(fs.readFileSync(pdfPath));
var book = [];

PDFJS.getDocument(data).then(function (doc) {

  var numPages = doc.numPages;
  var lastPromise; // will be used to chain promises
  lastPromise = doc.getMetadata().then(function (data) {
  });

  var loadPage = function (pageNum) {
    return doc.getPage(pageNum).then(function (page) {
      //console.log('# Page ' + pageNum);
      return page.getTextContent().then(function (content) {
        var strings = content.items.map(function (item) {
          return item.str.trim();
        });
        book.push(strings.join(''));
      });
    });
  };
  // Loading of the first page will wait on metadata and subsequent loadings
  // will wait on the previous pages.
  for (var i = 1; i <= numPages; i++) {
    lastPromise = lastPromise.then(loadPage.bind(null, i));
  }
  return lastPromise;

}).then(function () {
  //console.log('# End of Document');
  console.log('module.exports=');
  console.log(JSON.stringify(book));
}, function (err) {
  console.error('Error: ' + err);
});