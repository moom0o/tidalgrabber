var unirest = require('unirest');
const fs = require("fs");
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('names.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const search of rl) {
        console.log(search);
        const res = await unirest('GET', `https://kraken.squid.wtf/search/?s=${encodeURIComponent(search)}`)

                if (res.error || res.body["items"].length === 0 || res.body["items"][0]["id"] === false) {
                    fs.appendFile('./searcherrors.txt', search + "\n", (err) => {
                        if (err) throw err;
                    });
                    console.log(res.error);
                } else {
                    console.log(res.body["items"][0]["id"]);
                    fs.appendFile('./ids.txt', res.body["items"][0]["id"] + "\n", (err) => {
                        if (err) throw err;
                    });
                }

    }
}
processLineByLine().then(r => console.log("done"));