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
        const res = await unirest('GET', `https://triton.squid.wtf/search/?s=${encodeURIComponent(search)}`)

                if (res.error || res.body["data"]["items"].length === 0 || res.body["data"]["items"][0]["id"] === false) {
                    fs.appendFile('./searcherrors.txt', search + "\n", (err) => {
                        if (err) throw err;
                    });
                    console.log(res.error);
                } else {
                    let id = res.body["data"]["items"][0]["id"]
                    let name = res.body["data"]["items"][0]["title"]
                    let artist = res.body["data"]["items"][0]["artist"].name
                    console.log(`${id} ${artist} - ${name}`);
                    fs.appendFile('./ids.txt', `${id} ${artist} - ${name}` + "\n", (err) => {
                        if (err) throw err;
                    });
                }

    }
}
processLineByLine().then(r => console.log("done"));