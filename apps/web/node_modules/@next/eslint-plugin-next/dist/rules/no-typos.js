"use strict";
var _defineRule = require("../utils/define-rule");
var path = _interopRequireWildcard(require("path"));
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
var NEXT_EXPORT_FUNCTIONS = [
    "getStaticProps",
    "getStaticPaths",
    "getServerSideProps", 
];
// 0 is the exact match
var THRESHOLD = 1;
// the minimum number of operations required to convert string a to string b.
function minDistance(a, b) {
    var m = a.length;
    var n = b.length;
    if (m < n) {
        return minDistance(b, a);
    }
    if (n === 0) {
        return m;
    }
    var previousRow = Array.from({
        length: n + 1
    }, function(_, i) {
        return i;
    });
    for(var i1 = 0; i1 < m; i1++){
        var s1 = a[i1];
        var currentRow = [
            i1 + 1
        ];
        for(var j = 0; j < n; j++){
            var s2 = b[j];
            var insertions = previousRow[j + 1] + 1;
            var deletions = currentRow[j] + 1;
            var substitutions = previousRow[j] + Number(s1 !== s2);
            currentRow.push(Math.min(insertions, deletions, substitutions));
        }
        previousRow = currentRow;
    }
    return previousRow[previousRow.length - 1];
}
/* eslint-disable eslint-plugin/require-meta-docs-url */ module.exports = (0, _defineRule).defineRule({
    meta: {
        docs: {
            description: "Prevent common typos in Next.js data fetching functions.",
            recommended: true
        },
        type: "problem",
        schema: []
    },
    create: function create(context) {
        var checkTypos = function checkTypos(node, name) {
            if (NEXT_EXPORT_FUNCTIONS.includes(name)) {
                return;
            }
            var potentialTypos = NEXT_EXPORT_FUNCTIONS.map(function(o) {
                return {
                    option: o,
                    distance: minDistance(o, name)
                };
            }).filter(function(param) {
                var distance = param.distance;
                return distance <= THRESHOLD && distance > 0;
            }).sort(function(a, b) {
                return a.distance - b.distance;
            });
            if (potentialTypos.length) {
                context.report({
                    node: node,
                    message: "".concat(name, " may be a typo. Did you mean ").concat(potentialTypos[0].option, "?")
                });
            }
        };
        return {
            ExportNamedDeclaration: function ExportNamedDeclaration(node) {
                var page = context.getFilename().split("pages")[1];
                if (!page || path.parse(page).dir.startsWith("/api")) {
                    return;
                }
                var decl = node.declaration;
                if (!decl) {
                    return;
                }
                switch(decl.type){
                    case "FunctionDeclaration":
                        {
                            checkTypos(node, decl.id.name);
                            break;
                        }
                    case "VariableDeclaration":
                        {
                            decl.declarations.forEach(function(d) {
                                if (d.id.type !== "Identifier") {
                                    return;
                                }
                                checkTypos(node, d.id.name);
                            });
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
                return;
            }
        };
    }
});
