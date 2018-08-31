let DATA_URL = "";
let QUERY_STRING = "";
let x = "";
let valid = true;
let DATA_COMMENT = [];

const Output = require('../channelDetails').output;
const Comments = require('../randomComments').comment;

module.exports = (app, crypto) => {

    app.route('/')
        .get((req, res) => {
            res.render('container/index', {
                title: 'Hello User!',
                content: 'Welcome to youtube Comment viewer'
            });
        });

    app.route('/commentController')
        .post((req, res) => {
            DATA_URL = req.body.data_url;

            try {
                QUERY_STRING = new URL(DATA_URL).pathname.match(/^\/channel\/(.+)$/)[1];
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
                res.render('container/result', {
                    Id: data[0].id,
                    Title: data[0].snippet.title,
                    ViewCount: data[0].statistics.viewCount
                });
            }).catch((err) => {
                if (err) res.status(404).render('container/index', {
                    notFound: `Your request couldn't be completed ERR: ${err}`
                })
            })

    });

    app.route('/randomCommentView')
        .post((req, res) => {
            Comments(req.body.urlname)
                .then((data) => {
                    DATA_COMMENT = data;
                    console.log(DATA_COMMENT);
                }).catch(err => {
                    if (err) res.status(404).render('container/index', {
                        notFound: `Your request couldn't be completed ERR: ${err}`
                    })
                })
            res.redirect('/getComment');
        })

    app.get('/getComment', (req, res) => {
        res.render('container/comment', {
            Comment:DATA_COMMENT
        });
    })

}