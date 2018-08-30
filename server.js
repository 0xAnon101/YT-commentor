
const express = require('express');
const exphbs =  require('express-handlebars');
const path = require('path');
const bodyParser =  require('body-parser');
const app = express();
const crypto = require('crypto');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/assets/css',express.static(path.join(__dirname, '/public/stylesheets')));
app.use('/assets/js',express.static(path.join(__dirname+'/public/javascript')));
app.engine('.hbs',exphbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine','.hbs');

require('./routes/routes')(app,crypto);






const PORT = process.env.PORT || 3000;

app.listen(PORT,'127.0.0.1',()=> {
    console.log(`listening on port ${PORT}`);
});