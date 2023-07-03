let source;
const eventCallbacks = [];
let lastActivity = Date.now();
function getSocketProtocol(assetPrefix) {
    let protocol = location.protocol;
    try {
        // assetPrefix is a url
        protocol = new URL(assetPrefix).protocol;
    } catch (_) {}
    return protocol === "http:" ? "ws" : "wss";
}
export function addMessageListener(cb) {
    eventCallbacks.push(cb);
}
export function sendMessage(data) {
    if (!source || source.readyState !== source.OPEN) return;
    return source.send(data);
}
export function connectHMR(options) {
    if (!options.timeout) {
        options.timeout = 5 * 1000;
    }
    function init() {
        if (source) source.close();
        function handleOnline() {
            window.console.log("[HMR] connected");
            lastActivity = Date.now();
        }
        function handleMessage(event) {
            lastActivity = Date.now();
            eventCallbacks.forEach((cb)=>{
                cb(event);
            });
        }
        let timer;
        function handleDisconnect() {
            clearInterval(timer);
            source.onerror = null;
            source.close();
            setTimeout(init, options.timeout);
        }
        timer = setInterval(function() {
            if (Date.now() - lastActivity > options.timeout) {
                handleDisconnect();
            }
        }, options.timeout / 2);
        const { hostname , port  } = location;
        const protocol = getSocketProtocol(options.assetPrefix || "");
        const assetPrefix = options.assetPrefix.replace(/^\/+/, "");
        let url = protocol + "://" + hostname + ":" + port + (assetPrefix ? "/" + assetPrefix : "");
        if (assetPrefix.startsWith("http")) {
            url = protocol + "://" + assetPrefix.split("://")[1];
        }
        source = new window.WebSocket("" + url + options.path);
        source.onopen = handleOnline;
        source.onerror = handleDisconnect;
        source.onmessage = handleMessage;
    }
    init();
}

//# sourceMappingURL=websocket.js.map