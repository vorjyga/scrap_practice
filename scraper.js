const needle = require('needle');
const tress = require('tress');

const fs = require('fs');

const { url } = require('./vars');
const Parser = require('./formParser');

const textUrl = url + '/girl_info.php?id=';
const start = 1;
const end = 4890;

let picker = start;
const URL = () => textUrl + picker;

let results = [];



const q = tress((localUrl, done) => {

    needle.get(localUrl, (err, res) => {
        const userId = +localUrl.slice(-4).replace(/\D/g, '');
        if (err) {
            done(err, `error on ${userId}`);
        }
        try {
            const parser = new Parser(res.body);

            if (parser.isFormExist()) {
                results.push({
                    id: userId,
                    active: parser.getIsActive(),
                    approved: parser.isApproved(),
                    deleted: false,
                    name: parser.getName(),
                    comments: parser.getComments(),
                    link: localUrl,
                    phone: parser.getPhone(),
                    age: parser.getAHWBParams('age'),
                    height: parser.getAHWBParams('height'),
                    weight: parser.getAHWBParams('weight'),
                    breast: parser.getAHWBParams('breast'),
                    price: parser.getPrices(),
                    photos: parser.getPhotosLinks(),
                    text: parser.getText(),
                    // interests: parser.getInterests(),
                });
            }
            done(null, userId);
        }
        catch (e) {
            console.error('ERROR: ', e)
            done(e, userId);
        }
    });
}, 1);

q.drain = () => {
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
    console.log('Finished', results);
};

q.success = function(data) {
    fs.writeFileSync('./data.json', JSON.stringify(results, null, 4));
    console.log('Job ' + data + ' finished');
};

q.error = function(err, userId) {
    console.log('Job ' + userId + ' failed with error ' + err);
}

for (picker; picker <= end; picker++) {
    q.push(URL());
}
