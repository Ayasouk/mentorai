"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var data = "[{\"start\":0,\"end\":3.72,\"text\":\" Dans cette vidéo, on va voir ensemble 14 habitudes simples, qui peuvent vous permettre d'obtenir une énergie illimité.\"},{\"start\":24.16,\"end\":26.64,\"text\":\" Ces choses-là sont malheureusement pas enseignées à l'école\"},{\"start\":94.88,\"end\":98,\"text\":\" Il existe aussi ce qu'on appelle des matelapé EMF\"},{\"start\":653.92,\"end\":655.2,\"text\":\" l'exposition au froid.\"},{\"start\":806.8,\"end\":809.08,\"text\":\" qui est les exercices de respiration.\"},{\"start\":924.76,\"end\":928.12,\"text\":\" pour pouvoir en profiter encore plus\"},{\"start\":931.0,\"end\":933.92,\"text\":\" dorment en fait moins bien que les personnes\"},{\"start\":947.8,\"end\":949.36,\"text\":\" une plus grande énergie.\"}]";
var data2 = [{ "start": 0, "end": 15.52, "text": "pour votre énergie." }, { "start": 1402.72, "end": 1405.64, "text": "Premièrement, avoir un nom de calories adapté." }, { "start": 1439.439, "end": 1441.199, "text": "tester vos enterreurs alimentaires." }, { "start": 1519.48, "end": 1529.56, "text": "le jeûne." }, { "start": 1577.96, "end": 1580.32, "text": "Le sommeil." }, { "start": 1626.64, "end": 1637.479, "text": "se coucher, et se réveiller tous les jours à la même erreur." }, { "start": 1766.72, "end": 1777.68, "text": "Dans ma vie, j'ai eu la chance de rencontrer plus de 100 millionnaires." }];
var dataf = [
    "\"[{\\\"start\\\":6.96,\\\"end\\\":10.16,\\\"text\\\":\\\" Vous avez sûrement des coups de barres de la difficulté à vous réveiller.\\\"}]\"",
    "[{\"start\":1565.52,\"end\":1567.32,\"text\":\"Donc si on les réduit,\"},{\"start\":1577.96,\"end\":1579.44,\"text\":\"c'est le sommeil.\"},{\"start\":1639.36,\"end\":1641.52,\"text\":\"faites-le six jours par semaine,\"},{\"start\":1715.48,\"end\":1716.36,\"text\":\"Donc ça, c'est le premier point.\"},{\"start\":1762.12,\"end\":1764.24,\"text\":\"vous allez pouvoir accomplir beaucoup plus dans votre vie.\"},{\"start\":1772.56,\"end\":1774.8,\"text\":\"qui m'a aidé dans ma vie.\"}]"
];
var formatShorts = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var tab;
    return __generator(this, function (_a) {
        console.log(data);
        tab = [];
        data.map(function (shorttab) {
            if (typeof (shorttab) === "string") {
                var elem = shorttab.split("{");
                var obj = void 0;
                for (var i = 0; i < elem.length; i++) {
                    if (elem[i] === "[") {
                    }
                    else {
                        elem[i] = elem[i].slice(0, -1);
                        obj = JSON.parse("{" + elem[i]);
                        tab.push(obj);
                    }
                }
            }
            else {
                for (var i = 0; i < shorttab.length; i++) {
                    tab.push(shorttab[i]);
                }
            }
        });
        return [2 /*return*/, tab];
    });
}); };
var arr1 = ["1", "2", "3"];
var ar2 = ["4", "5"];
var res = arr1.concat(ar2);
console.log(res);
//const res = formatShorts([data, data2]);
/*res.then((data)=>{
    console.log(data);
})
*/
exports.default = formatShorts;
