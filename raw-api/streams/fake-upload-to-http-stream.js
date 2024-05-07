import { Readable } from "node:stream"


class OneToHundredStream extends Readable {
    index = 1

    _read() {
            const i = this.index++

            if (i > 100) {
                this.push(null)
            } else {
                const buf = new Buffer.from(String(i))
                this.push(buf)
            }
    }
}

fetch("http://localhost:3334", {
    method: "POST",
    body: new OneToHundredStream(),
    duplex: 'half',
})