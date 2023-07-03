"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _gethostname = require("./get-hostname");
describe("getHostname", ()=>{
    describe("from URL", ()=>{
        it.each([
            {
                url: "http://example.com",
                hostname: "example.com"
            },
            {
                url: "http://example.com/",
                hostname: "example.com"
            },
            {
                url: "http://example.com:3000",
                hostname: "example.com"
            },
            {
                url: "https://example.com",
                hostname: "example.com"
            },
            {
                url: "https://example.com/",
                hostname: "example.com"
            },
            {
                url: "https://example.com:3000",
                hostname: "example.com"
            },
            {
                url: "http://localhost",
                hostname: "localhost"
            },
            {
                url: "http://localhost/",
                hostname: "localhost"
            },
            {
                url: "http://localhost:3000",
                hostname: "localhost"
            },
            {
                url: "http://127.0.0.1",
                hostname: "127.0.0.1"
            },
            {
                url: "http://127.0.0.1/",
                hostname: "127.0.0.1"
            },
            {
                url: "http://127.0.0.1:3000",
                hostname: "127.0.0.1"
            },
            {
                url: "http://8.8.8.8",
                hostname: "8.8.8.8"
            },
            {
                url: "http://8.8.8.8/",
                hostname: "8.8.8.8"
            },
            {
                url: "http://8.8.8.8:3000",
                hostname: "8.8.8.8"
            }
        ])("should return $hostname for $url", (param)=>{
            let { url , hostname  } = param;
            const parsed = new URL(url);
            // Base case.
            expect((0, _gethostname.getHostname)(parsed)).toBe(hostname);
            // With headers.
            expect((0, _gethostname.getHostname)(parsed, {
                host: parsed.host
            })).toBe(hostname);
            // With an empty headers array.
            expect((0, _gethostname.getHostname)(parsed, {
                host: []
            })).toBe(hostname);
            // With a headers array.
            expect((0, _gethostname.getHostname)({}, {
                host: [
                    parsed.host
                ]
            })).toBe(undefined);
        });
    });
    it("should return undefined for empty input", ()=>{
        expect((0, _gethostname.getHostname)({})).toBe(undefined);
        expect((0, _gethostname.getHostname)({}, {
            host: []
        })).toBe(undefined);
    });
});

//# sourceMappingURL=get-hostname.test.js.map