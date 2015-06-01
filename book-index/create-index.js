var book = require('./book.js');
var keywords = require('./keywords.js');

var numPage = book.length;
if (numPage>280) numPage=208;

keywords.forEach(function(keyword){
	var index = [keyword];
	keyword = keyword.toLowerCase();
	for(var idx=0; idx<numPage; idx++) {
		var page = book[idx].toLowerCase();
		if(page.indexOf(keyword)>=0) {
			index.push(idx+1);
		}
	}
	console.log(index.join(', '));
});
