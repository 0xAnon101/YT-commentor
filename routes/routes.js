
let DATA_URL = "";
let QUERY_STRING = "";
let x = "";


  
module.exports = (app,crypto) => {
  
    app.get('/',(req,res)=> {
        res.render('container/index', {
            title:'Hello User!',
            comtent: 'Welcome to youtube Comment viewer'}
        );
    });

    app.route('/commentController')
    .post((req,res) =>{
       DATA_URL = req.body.data_url;
      
       try { 
        QUERY_STRING = new URL(req.body.data_url).pathname.match(/^\/channel\/(.+)$/)[1];
       }
       catch(err) {
        if(err)  res.status(404).send('The URL is invalid! Not Found')
       }
       crypto.pbkdf2(QUERY_STRING, '3745e48...08d59ae', 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        x = derivedKey.toString('hex'); 
       });

       const hash = crypto.createHash('sha256');
       hash.update(x + QUERY_STRING);
       const result = hash.digest('hex')
       res.redirect(`/result/success/${result}`);
    })
    .get((req,res) => {
        res.sendStatus(403);
    })

    app.get('/result/:value/:secret',(req,res)=> {
        res.render('container/result', {
            title:'Hello User!',
            comtent: 'Welcome to youtube Comment viewer',
            URL: DATA_URL,
            QUERY: QUERY_STRING
            }
        );
    });
}