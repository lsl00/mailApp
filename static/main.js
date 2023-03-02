var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var idmail = document.querySelector("input[name='IDmail']");
var idinfo = document.querySelector("input[name='IDinfo']");
var subjectE = document.querySelector("input[name='subject']");
var fromE = document.querySelector("input[name='from']");
var temp = document.querySelector("textarea");
var which = document.querySelector("#whichid"); //select
var host = document.querySelector("input[name='Host']");
var user = document.querySelector("input[name='User']");
var pass = document.querySelector("input[name='Pass']");
var sendto = document.querySelector("#sendto");
var preview = document.querySelector("#preview");
var config = document.querySelector("#config");
var statusUl = document.querySelector("#Status");
config.addEventListener("change", function (e) {
    if (!config.files)
        return;
    var f = config.files[0];
    f.slice()
        .text()
        .then(function (t) { return JSON.parse(t); })
        .then(function (obj) {
        var _a, _b, _c, _d, _e, _f;
        host.value = (_a = obj['hostname']) !== null && _a !== void 0 ? _a : host.value;
        user.value = (_b = obj['username']) !== null && _b !== void 0 ? _b : user.value;
        pass.value = (_c = obj['password']) !== null && _c !== void 0 ? _c : pass.value;
        subjectE.value = (_d = obj['subject']) !== null && _d !== void 0 ? _d : subjectE.value;
        fromE.value = (_e = obj['from']) !== null && _e !== void 0 ? _e : fromE.value;
        temp.value = (_f = obj['template']) !== null && _f !== void 0 ? _f : temp.value;
    });
});
var item = /** @class */ (function () {
    function item(b, s, c) {
        this.what = b;
        this.str = s;
        this.column = c;
    }
    return item;
}());
function parse(s) {
    var result = [];
    var length = s.length;
    var begin = 0, end = 0;
    while (end < length) {
        if (s.charAt(end) != '%') {
            end++;
            continue;
        }
        if (begin < end) {
            result.push(new item(false, s.substring(begin, end), null));
        }
        end = end + 1;
        begin = end;
        while (end < length) {
            if (s.charAt(end) != '%') {
                end++;
                continue;
            }
            break;
        }
        if (begin == end) {
            result.push(new item(false, '%', null));
        }
        else {
            var subs = s.substring(begin, end);
            var col = parseInt(subs);
            result.push(new item(true, null, col));
        }
        end = end + 1;
        begin = end;
    }
    if (begin != end)
        result.push(new item(false, s.substring(begin), null));
    return result;
}
function generate(template, a) {
    return template.map(function (it) {
        if (it.what && it.column) {
            return a[it.column];
        }
        else {
            return it.str;
        }
    }).join("");
}
function parseCSV(s) {
    var x = s.split('\n');
    return x.map(function (s) { return s.trim().split(','); });
}
function SendAll() {
    var hostname = host.value;
    var username = user.value;
    var password = pass.value;
    var subject = subjectE.value;
    var from = fromE.value;
    mails.forEach(function (m, id) {
        var line = contents.get(id);
        if (line != null) {
            var content = generate(template, line);
            fetch("/send", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hostname: hostname,
                    username: username,
                    password: password,
                    from: from,
                    subject: subject,
                    content: content,
                    to: m
                })
            })
                .then(function (resp) { return resp.text(); })
                .then(function (value) {
                var li = document.createElement("li");
                li.innerText = "Send to" + m + " " + value;
                statusUl.appendChild(li);
            });
        }
    });
}
function FromFile(f) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, f.slice().text()
                    .then(function (t) { return parseCSV(t); })];
        });
    });
}
var mails = new Map();
var contents = new Map();
var template;
which.addEventListener("change", function () {
    var _a;
    var currentWho = which.value;
    console.log(currentWho);
    sendto.innerText = (_a = mails.get(currentWho)) !== null && _a !== void 0 ? _a : "";
    console.log(contents.get(currentWho));
    preview.innerText = generate(template, contents.get(currentWho));
});
function view() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var mail, infos, currentWho;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, FromFile(idmail.files[0])];
                case 1:
                    mail = _b.sent();
                    return [4 /*yield*/, FromFile(idinfo.files[0])];
                case 2:
                    infos = _b.sent();
                    mails.clear();
                    contents.clear();
                    mail.forEach(function (e) {
                        mails.set(e[0], e[1]);
                    });
                    infos.forEach(function (e) {
                        contents.set(e[0], e);
                    });
                    template = parse(temp.value);
                    console.log(template);
                    mails.forEach(function (v, id) {
                        if (!contents.has(id))
                            return;
                        var e = document.createElement("option");
                        e.setAttribute("value", id);
                        e.innerText = id;
                        which.appendChild(e);
                    });
                    currentWho = which.value;
                    sendto.innerText = (_a = mails.get(currentWho)) !== null && _a !== void 0 ? _a : "";
                    preview.innerText = generate(template, contents.get(currentWho));
                    return [2 /*return*/];
            }
        });
    });
}
function Preview() {
    view().then();
}
function test() {
    var temp = parse("balaba%1%%%ndsao%2%d%%");
    parseCSV("1,2,3\n4,5,6\n7,8,9").forEach(function (element) {
        console.log(generate(temp, element));
    });
}
