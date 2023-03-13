const generateNFT = async (images,w,h,m) => {

let imageArrays = [];

for(var i=0;i<images.data.length;i++) {
let layerArray=[];
for(var j=0;j<images.data[i].files.length;j++) {
layerArray.push(images.data[i].files[j].src);
}

if(images.data[i].files.length)
imageArrays.push(layerArray);

}

console.log(imageArrays);

let result = await createAllCombinations(imageArrays);
let nft = await createCanvas(result,w,h,m);

return nft;	

}

/************/

async function createCanvas(result,w,h,m) {
	
let nft = [];	

var canvas = document.createElement('canvas');
canvas.width  = w;
canvas.height = h;

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

var ctx = canvas.getContext("2d");

if(m=='image/png') {
ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
}
else {
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);	
}

for(var i=0;i<result.length;i++) {
for(var j=0;j<result[i].length;j++) {
await loadImage(ctx,result[i][j],canvas);
}
canvas.remove();

let dataURL

if(m=='image/jpg' || m=='image/jpeg')
dataURL = canvas.toDataURL(m, 1.0);
else
dataURL = canvas.toDataURL(m);

nft.push({original: dataURL, thumbnail: dataURL});
}

return nft;

}

/************/

async function loadImage(ctx,src,canvas) {
return new Promise((resolve, reject) => {
let img = new Image();
img.src = src;
img.onload = () => {
let x = Number(canvas.width/2)-	Number(img.width/2);
let y = Number(canvas.height/2)-Number(img.height/2);
ctx.drawImage(img, x, y, img.width, img.height);	
resolve()
}
})
}

/************/

async function createAllCombinations(arrays) {
let results = [];
let numArrays = arrays.length;
let currentCombination = [];

function generateCombinations(depth) {
if (depth === numArrays) {
results.push([...currentCombination]);
return;
}

let currentArray = arrays[depth];

for (let i = 0; i < currentArray.length; i++) {
currentCombination[depth] = currentArray[i];
generateCombinations(depth + 1);
}
}

/************/

generateCombinations(0);
return results;

/************/

}

/************/

export { generateNFT };