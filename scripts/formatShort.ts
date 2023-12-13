const data = "[{\"start\":0,\"end\":3.72,\"text\":\" Dans cette vidéo, on va voir ensemble 14 habitudes simples, qui peuvent vous permettre d'obtenir une énergie illimité.\"},{\"start\":24.16,\"end\":26.64,\"text\":\" Ces choses-là sont malheureusement pas enseignées à l'école\"},{\"start\":94.88,\"end\":98,\"text\":\" Il existe aussi ce qu'on appelle des matelapé EMF\"},{\"start\":653.92,\"end\":655.2,\"text\":\" l'exposition au froid.\"},{\"start\":806.8,\"end\":809.08,\"text\":\" qui est les exercices de respiration.\"},{\"start\":924.76,\"end\":928.12,\"text\":\" pour pouvoir en profiter encore plus\"},{\"start\":931.0,\"end\":933.92,\"text\":\" dorment en fait moins bien que les personnes\"},{\"start\":947.8,\"end\":949.36,\"text\":\" une plus grande énergie.\"}]";
const data2 = [  {    "start": 0,    "end": 15.52,    "text": "pour votre énergie."  },  {    "start": 1402.72,    "end": 1405.64,    "text": "Premièrement, avoir un nom de calories adapté."  },  {    "start": 1439.439,    "end": 1441.199,    "text": "tester vos enterreurs alimentaires."  },  {    "start": 1519.48,    "end": 1529.56,    "text": "le jeûne."  },  {    "start": 1577.96,    "end": 1580.32,    "text": "Le sommeil."  },  {    "start": 1626.64,    "end": 1637.479,    "text": "se coucher, et se réveiller tous les jours à la même erreur."  },  {    "start": 1766.72,    "end": 1777.68,    "text": "Dans ma vie, j'ai eu la chance de rencontrer plus de 100 millionnaires."  }]
const dataf = [
    "\"[{\\\"start\\\":6.96,\\\"end\\\":10.16,\\\"text\\\":\\\" Vous avez sûrement des coups de barres de la difficulté à vous réveiller.\\\"}]\"",
    "[{\"start\":1565.52,\"end\":1567.32,\"text\":\"Donc si on les réduit,\"},{\"start\":1577.96,\"end\":1579.44,\"text\":\"c'est le sommeil.\"},{\"start\":1639.36,\"end\":1641.52,\"text\":\"faites-le six jours par semaine,\"},{\"start\":1715.48,\"end\":1716.36,\"text\":\"Donc ça, c'est le premier point.\"},{\"start\":1762.12,\"end\":1764.24,\"text\":\"vous allez pouvoir accomplir beaucoup plus dans votre vie.\"},{\"start\":1772.56,\"end\":1774.8,\"text\":\"qui m'a aidé dans ma vie.\"}]"
]
const formatShorts = async (data:Array<any>) => {
    console.log(data);
    let tab:any[] = [];
    data.map((shorttab:any)=>{
      if(typeof(shorttab)==="string") {
        let elem = shorttab.split("{");
        let obj;
        for(let i=0; i<elem.length; i++){
            if(elem[i]==="["){

            } else {
                elem[i] = elem[i].slice(0,-1);
                obj = JSON.parse("{"+elem[i]);
                tab.push(obj);
            }
            
        }
      } else {
        for(let i=0; i<shorttab.length; i++){
            tab.push(shorttab[i]);
        }
      }
    })
    return tab;
  }
  
  let arr1 = ["1", "2", "3"];
  let ar2 = ["4", "5"];

  const res = arr1.concat(ar2);

console.log(res);
//const res = formatShorts([data, data2]);

/*res.then((data)=>{
    console.log(data);
})
*/

export default formatShorts;
