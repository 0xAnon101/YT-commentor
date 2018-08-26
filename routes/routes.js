let DATA_URL = "";
let QUERY_STRING = "";
let x = "";
let valid = true;

const Output = require('../quickstart').output;

module.exports = (app, crypto) => {

    app.get('/', (req, res) => {
        res.render('container/index', {
            title: 'Hello User!',
            comtent: 'Welcome to youtube Comment viewer'
        });
    });

    app.route('/commentController')
        .post((req, res) => {
            DATA_URL = req.body.data_url;

            try {
                QUERY_STRING = new URL(req.body.data_url).pathname.match(/^\/channel\/(.+)$/)[1];
            } catch (err) {
                valid = false;
                if (err) res.status(404).render('container/index', {
                    notFound: `Such Channel link doesn't exist`
                })
            }
            console.log(valid)
            if (valid) {
                crypto.pbkdf2(QUERY_STRING, '3745e48...08d59ae', 100000, 64, 'sha512', (err, derivedKey) => {
                    if (err) throw err;
                    x = derivedKey.toString('hex');
                });

                const hash = crypto.createHash('sha256');
                hash.update(x + QUERY_STRING);
                const result = hash.digest('hex')
                res.redirect(`/result/success/${result}`)
            } else null;
            valid = true;
        })
        .get((req, res) => {
            res.sendStatus(403);
        })

    app.get('/result/:value/:secret', (req, res) => {
        Output(QUERY_STRING)
            .then((data) => {

                console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                    'it has %s views.',
                    data[0].id,
                    data[0].snippet.title,
                    data[0].statistics.viewCount);
            }).catch((err) => {
                if (err) res.status(404).render('container/index', {
                    notFound: `Your request couldn't be completed ERR: ${err}`
                })
            })
        res.render('container/result', {
            title: 'Hello User!',
            comtent: 'Welcome to youtube Comment viewer',
            URL: DATA_URL,
            QUERY: QUERY_STRING
        });
    });
}

module.exports.QUERY_STRING = QUERY_STRING;