var page = require('webpage').create(),
    system = require('system'),
    address = system.args[1],
    output = system.args[2];
//page.viewportSize = { width:1095, height:555 };
page.open(address, function () {
  page.render(output);
	phantom.exit();
});