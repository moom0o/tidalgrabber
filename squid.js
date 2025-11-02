var unirest = require('unirest');
const fs = require("fs");
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('ids.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const search of rl) {
        console.log(search);
        await request(search);
    }
}


async function request(search) {
    const res = await unirest('GET', `https://wolf.qqdl.site/track/?id=${encodeURIComponent(search)}&quality=LOSSLESS`)

    if (res.error || !res.body[2] || !res.body[2]["OriginalTrackUrl"]) {
        console.log(res.raw_body);
        if(res.body["detail"] && res.body["detail"] === "Too Many Requests") {
            await request(search)
        } else {
            fs.appendFile('./squiderrors.txt', search + "\n", (err) => {
                if (err) throw err;
            });
        }
    } else {
        console.log(`${res.body[2]["OriginalTrackUrl"]} ${res.body[0]["artist"]["name"]} - ${res.body[0]["title"]}`);
        fs.appendFile('./urls.txt', `${res.body[2]["OriginalTrackUrl"]} ${res.body[0]["artist"]["name"]} - ${res.body[0]["title"]}` + "\n", (err) => {
            if (err) throw err;
        });
    }
}
processLineByLine().then(r => console.log("done"));