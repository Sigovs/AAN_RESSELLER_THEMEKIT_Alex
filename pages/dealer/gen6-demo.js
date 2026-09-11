// Gen 6 prototypes — shared demo set (12 vehicles). Prototype-only.
window.G6 = [
 {s:"18421",y:2021,mk:"SUNDOWNER",md:"Sunlite Argo 40GN",tr:"Trailer",c:"White",hx:"#ececea",p:null,d:1917,f:["No price","No photos","Feed off","Hidden"],t:null},
 {s:"18837C",y:2017,mk:"Kia",md:"Forte",tr:"LX Sedan · Popular Package",c:"Snow White Pearl",hx:"#eeeeec",p:null,d:1409,f:["No price","Feed off","Hidden","Pending"],t:"d91496ae-10166_main_t.jpg"},
 {s:"19495",y:2016,mk:"Kenworth",md:"W900L",tr:"ICON 900 Sleeper · ISX 550",c:"Daydream Blue",hx:"#2b64b8",p:100800,d:1566,f:[],t:"f7aed7d4-9678_main_t.jpg"},
 {s:"21234",y:1995,mk:"Honda",md:"ACTY",tr:"Pick-up · RHD · 656cc",c:"Yellow",hx:"#e8c027",p:null,d:726,f:["No price","No photos"],t:null},
 {s:"21868A",y:2024,mk:"Mercedes-Benz",md:"Sprinter 3500",tr:"Ultimate Coach Executive",c:"Jet Black",hx:"#1c1d21",p:null,d:428,f:["No price","Pending"],t:"b2180cdc-12716_main_t.jpg"},
 {s:"21898",y:1989,mk:"Lamborghini",md:"Countach",tr:"25th Anniversary · 1/657",c:"Black",hx:"#1c1d21",p:750000,d:421,f:[],t:"b59227aa-12742_main_t.jpg"},
 {s:"21927",y:2018,mk:"Porsche",md:"911 GT2 RS",tr:"Weissach · Magnesium wheels",c:"PTS Volcano Grey",hx:"#6b6f74",p:899500,d:408,f:[],t:"f5c2cee4-11865_main_t.jpg"},
 {s:"1X289324 JJ",y:2018,mk:"Mercedes-Benz",md:"G550 4×4 Squared",tr:"Brabus B40-500",c:"Black",hx:"#1c1d21",p:199500,d:156,f:[],t:"bda50d2c-13478_main_t.jpg"},
 {s:"1284NEBR MS",y:1967,mk:"Chevrolet",md:"Corvette",tr:"LS3 525hp Restomod",c:"Goodwood Green",hx:"#2f5b3f",p:259500,d:100,f:[],t:"97253f70-13663_main_t.jpg"},
 {s:"21577C",y:1971,mk:"Lamborghini",md:"Espada Series II",tr:"V12 · 5-speed manual",c:"Silver",hx:"#b7bbc1",p:149500,d:71,f:[],t:"80d11de6-13745_main_t.jpg"},
 {s:"0P0300236 PS",y:2023,mk:"Ferrari",md:"812 GTS",tr:"Tailor Made · 1 of 1",c:"Verde Zeltweg",hx:"#245c3e",p:1099500,d:40,f:[],t:"277624e2-13868_main_t.jpg"},
 {s:"001253 PS",y:2005,mk:"Porsche",md:"Carrera GT",tr:"953 miles · Full luggage",c:"GT Silver Metallic",hx:"#b7bbc1",p:null,d:23,f:["No price"],t:"8ccfc032-12441_main_t.jpg"},
 {s:"20710",y:2002,mk:"Cadillac",md:"Eldorado ETC",tr:"Northstar · 700 miles",c:"White Diamond",hx:"#ece9e2",p:null,d:988,f:["No price","No photos","Feed off","Hidden"],t:null},
 {s:"20870",y:1991,mk:"Mercedes-Benz",md:"SL 60 AMG",tr:"1 of 50 produced",c:"Arctic White",hx:"#f0f0ec",p:null,d:926,f:["No price","No photos","Feed off","Hidden","Pending"],t:null},
 {s:"20834E",y:2014,mk:"Dodge",md:"SRT Viper GTS",tr:"TA 1.0 · Carbon Aero",c:"Venom Black",hx:"#1a1a1c",p:null,d:23,f:["No price"],t:"4412bb96-13918_main_t.jpg"}
];
window.G6.vin=function(s){var A="ABCDEFGHJKLMNPRSTUVWXYZ0123456789",h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;var o="";for(var k=0;k<17;k++){h=(h*1103515245+12345)>>>0;o+=A[h%A.length]}return o};
window.G6.band=function(d){return d<=30?"fresh":d<=90?"mid":d<=365?"late":"stale"};
window.G6.lab=function(d){return d>365?(d/365).toFixed(1)+"y":d+"d"};
window.G6.col={fresh:"#2fb46f",mid:"#b3bac6",late:"#f0a22e",stale:"#e35548"};
window.G6.tone={"Feed off":"red","Hidden":"slate","Pending":"violet"};
