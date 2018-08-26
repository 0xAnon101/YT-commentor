
const express = require('express');
const exphbs =  require('express-handlebars');
const path = require('path');
const bodyParser =  require('body-parser');
const app = express();
const crypto = require('crypto');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require('./routes/routes')(app,crypto);

app.engine('.hbs',exphbs({defaultLayout:'layout',extname:'.hbs'}));
app.set('view engine','.hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/assets',express.static(path.join(__dirname, '/public/stylesheets')));







const PORT = process.env.PORT || 3000;

app.listen(PORT,'127.0.0.1',()=> {
    console.log(`listening on port ${PORT}`);
});