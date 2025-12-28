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


async function request(string) {
    let args = string.split(' ')
    let name = args.slice(1).join(" ")
    let search = args[0]
    const res = await unirest('GET', `https://tidal.kinoplus.online/track/?id=${encodeURIComponent(search)}&quality=LOSSLESS`)
    let url = JSON.parse(Buffer.from(res.body["data"]["manifest"], 'base64').toString('utf-8')).urls[0];
    if (res.error || !url) {
        console.log(res.raw_body);
        if(res.body["detail"] && res.body["detail"] === "Too Many Requests") {
            await request(args)
        } else {
            fs.appendFile('./squiderrors.txt', args + "\n", (err) => {
                if (err) throw err;
            });
        }
    } else {
        console.log(`${url} ${name}`);
        fs.appendFile('./urls.txt', `${url} ${name}` + "\n", (err) => {
            if (err) throw err;
        });
    }
}
processLineByLine().then(r => console.log("done"));