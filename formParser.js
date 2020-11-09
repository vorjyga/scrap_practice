const cheerio = require('cheerio');
const { url } = require('./vars');


class Parser {
    constructor(body) {
        this.$ = cheerio.load(body);
    }

    isFormExist() {
        const isExist = this.$('table td[width="590"][align="left"] > div[style="width:560px; margin:15px;"]').children().length;
        return !!isExist;
    }

    getAHWBParams(name) {
        const text = this.$('table[width="100%"]').find('tr > td[width="34%"]').text();

        switch (name) {
            case 'age':
                return text.slice(15, 17);
            case 'height':
                return text.slice(28, 31);
            case 'weight':
                return text.slice(40, 43);
            case 'breast':
                return text.slice(58, 59);

        }
    };

    // New solution (worked)
    getPrices() {
        const text = this.$('table[width="100%"]').find('tr > td[width="32%"]').text();
        const out = text.slice(text.indexOf('Выезд:'));

        if (text) {
            const apartsOne = text.indexOf('1 час:'), // 7
                apartsTwo = text.indexOf('2 часа:'), // 8
                apartsNight = text.indexOf('Ночь:'), // 6 length

                outOne = out.indexOf('1 час:'),
                outTwo = out.indexOf('2 часа:'),
                outNight = out.indexOf('Ночь:');

            return {
                aparts: {
                    one: text.slice(apartsOne + 7, apartsTwo - 1),
                    two: text.slice(apartsTwo + 8, apartsNight - 1),
                    night: text.slice(apartsNight + 6, text.indexOf('Выезд:') - 2),
                },
                out: {
                    one: out.slice(outOne + 7, outTwo - 1),
                    two: out.slice(outTwo + 8, outNight - 1),
                    night: out.slice(outNight + 6, out.length - 2),
                }
            }
        }
    }

    // Old solution (Worked)
    getPrice(col, row) {
        const text = this.$('table[width="100%"]').find('tr > td[width="32%"]').eq(col).contents().eq(row).text();
        return isNaN(parseInt(text.slice(-6))) ? 0 : parseInt(text.slice(-6));
    };

    getPhotosLinks() {
        return this.$('a[class^="gallery"]').toArray().map(i => `${url}/${i.attribs.href}`);
    }

    getText() {
        const text = this.$('span.phone').next().next()[0].nextSibling.data;
        return text ? text.replace(/\n/g, '') : 'Oops...';
    }

    getName() {
        return this.$('table[width="100%"]').find('td[align="left"][valign="top"]').find('h1').text();
    }

    getComments() {
        return +this.$('a#comments').text().replace(/\D/g, '');
    }

    getIsActive() {
        return this.$('span.phone').text()[0] === '+';
    }

    getPhone() {
        return this.$('span.phone').text();
    }

    // todo
    getInterests() {
        const query = this.$('tbody');
        const table = query.eq(query.length - 2);
        table.find('img[src="/imgs/iy.gif"]').replaceWith('<span>Yes</span>');
        table.find('img[src="/imgs/in.gif"]').replaceWith('<span>No</span>');
        return table.html();
    }

    isApproved() {
        return this.$('div[style="width:560px; margin:15px;"]:contains("Фото проверены")').length > 0;
    }
}

module.exports = Parser;