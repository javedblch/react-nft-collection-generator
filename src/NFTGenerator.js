import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { generateNFT } from './modules/generateNFT';
import Modal from "./components/Modal";
import Error from "./components/Error";
import Generate from "./components/Generate";

const NFTGenerator = () => {

const [currLayer, setCurrLayer] = useState("layer-1");
const [images, setImages] = useState({"data":[]});	

const [imageWidth, setImageWidth] = useState(0);
const [imageHeight, setImageHeight] = useState(0);

const [layerName, setLayerName] = useState('');
const [nft, setNft] = useState([]);

const [showGenerate, setShowGenerate] = useState([]);
const [showPreview, setShowPreview] = useState([]);
const [showError, setShowError] = useState([]);
const [showMSG, setShowErrorMSG] = useState([]);

const defaultList = ["A", "B", "C", "D", "E"];
const [itemList, setItemList] = useState(defaultList);

const tooltip = (
<Tooltip id="tooltip">
Click to select layer. <br/>Press to drag.
</Tooltip>
);

const handleDrop = (droppedItem) => {

if (!droppedItem.destination) return;
var updatedList = [...images.data];

const fromIndex = droppedItem.source.index; 
const toIndex = droppedItem.destination;

const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

let json = {"data":[]};

for(var i=0;i<updatedList.length;i++)
json.data.push(updatedList[i]);

setImages(json);

};

/************/

const handleLayerName = (event) => {
setLayerName(event.target.value);
}

/************/

function readFileAsync(file,json) {

return new Promise((resolve, reject) => {

let fileName = file.name;

let reader = new FileReader();

reader.onload = async(e) => {
	
let [w,h] = await getImageDimensions(e.target.result);	

if(imageWidth<w)
setImageWidth(w);

if(imageHeight<h)
setImageHeight(h);
	
for(var i=0;i<json.data.length;i++) {	
if(json.data[i].name==currLayer) {
json.data[i].files.push({ id: fileName, src: e.target.result })
resolve(json);
break;
}
}

};//onload

reader.onerror = reject;
reader.readAsDataURL(file);

})
}

/************/

function getImageDimensions(result) {
return new Promise((resolve, reject) => {
var image = new Image();
image.src = result;
image.onload = function() {
resolve([image.width,image.height]);
};
})
}

/************/

const generate = async() => {

let json = JSON.stringify(images);
json=JSON.parse(json);

if(!json.data.length) {
setShowError(['show']);
setShowErrorMSG('Add layers to generate nft');
return;	
}

let filesExists=false;

for(var i=0;i<json.data.length;i++) {
if(json.data[i].files.length>0) {
filesExists=true;	
break;
}
}

if(filesExists==false) {
setShowError(['show']);
setShowErrorMSG('Cannot proceed with empty layers!');
return;
}

setShowGenerate(['show'])

}

/************/

const preview = async() => {
		
let json = JSON.stringify(images);
json=JSON.parse(json);

if(!json.data.length) {
setShowError(['show']);
setShowErrorMSG('Add layers to preview');
return;	
}

let filesExists=false;

for(var i=0;i<json.data.length;i++) {
if(json.data[i].files.length>0) {
filesExists=true;	
break;
}
}

if(filesExists==false) {
setShowError(['show']);
setShowErrorMSG('Cannot proceed with empty layers!');
return;
}

let w = imageWidth;
let h = imageHeight;
let mime = 'image/png';

let result = await generateNFT(images,w,h,mime);
setNft(result);

setShowPreview(['show']);

}

/************/

const selectLayer = (e) => {
let curr=e.currentTarget.getAttribute('data-id').replace('text-','');
setCurrLayer(curr);
}//selectLayer

/************/

const editLayer = (e) => {
	
let curr=e.currentTarget.getAttribute('data-id').replace('edit-','').trim();

document.querySelector('[data-id="edit-div-'+curr+'"]').classList.remove("d-none")
document.querySelector('[data-id="div-'+curr+'"]').classList.add("d-none");
document.querySelector('[data-id="edit-text-'+curr+'"]').focus();

}//editLayer

/************/

const cancelLayer = (e) => {
	
let curr=e.currentTarget.getAttribute('data-id').replace('cancel-','');

document.querySelector('[data-id="edit-div-'+curr+'"]').classList.add("d-none");
document.querySelector('[data-id="div-'+curr+'"]').classList.remove("d-none");

}

/************/

const updateLayer = (e) => {
		
let currLayerName=e.currentTarget.getAttribute('data-id').replace('update-','');
let newLayerName=document.querySelector('[data-id="edit-text-'+currLayerName+'"]').value.trim();

let count=0;

if(!newLayerName.trim().length) {
setShowError(['show']);
setShowErrorMSG('Invalid layer name input');
return;
}

let json = JSON.stringify(images);
json = JSON.parse(json);

for(var i=0;i<json.data.length;i++) {
if(json.data[i].name==newLayerName && json.data[i].name!=currLayerName) {
setShowError(['show']);
setShowErrorMSG(newLayerName+' already exists');
return;
}
else {
count++;	
}
}

document.querySelector('[data-id="text-'+currLayerName+'"]').value=newLayerName;

document.querySelector('[data-id="edit-div-'+currLayerName+'"]').classList.add("d-none");

document.querySelector('[data-id="div-'+currLayerName+'"]').classList.remove("d-none");

for(var i=0;i<json.data.length;i++) {
if(json.data[i].name==currLayerName) {
json.data[i].name=newLayerName;

break;
}
}

setCurrLayer(newLayerName);
setImages(json);

}

/************/

const deleteLayer = (e) => {
		
let curr=e.currentTarget.getAttribute('data-id').replace('delete-','');

let imagesJSON=JSON.stringify(images);
imagesJSON=JSON.parse(imagesJSON);

for(var i=0;i<imagesJSON.data.length;i++) {

let keys = Object.values(imagesJSON.data[i]);

if(keys[0]==curr) {
imagesJSON.data.splice(i,1);
break;
}
}

if(!imagesJSON.data.length)
imagesJSON={"data":[{"name":"layer-1","files":[]}]};

setImages(imagesJSON);
setCurrLayer(imagesJSON.data[0].name);

}

/************/

const addLayer = () => {

if(!layerName.length) {
setShowError(['show'])
setShowErrorMSG('Invalid Layer Name!');
return;
}

let json = JSON.stringify(images);
json = JSON.parse(json);

for(var i=0;i<json.data.length;i++) {
if(json.data[i].name==layerName) {
setShowError(['show'])
setShowErrorMSG('Layer '+layerName+' already exists');
return;	
}
}

json.data.push({"name":layerName,"files":[]});

setImages(json);
setLayerName('');
setCurrLayer(layerName);

document.querySelector('[data-id="name_txt"]').value='';

}

/************/

const deleteImage = (e) => {

let curr=0;
let imageName=e.currentTarget.getAttribute('data-id').replace('delete-','');
let json = JSON.stringify(images);
json = JSON.parse(json);

for(var i=0;i<json.data.length;i++) {
if(json.data[i].name==currLayer) {
curr=i;
break;
}
}

for(var i=0;i<json.data[curr].files.length;i++) {
if(json.data[curr].files[i].id==imageName) {
json.data[curr].files.splice(i,1);
break;
}
}

setImages(json);
		
}
	
/************/

async function initiateUpload() {
	
let json = JSON.stringify(images);
json=JSON.parse(json);

if(!json.data.length) {
setShowError(['show'])
setShowErrorMSG('Add layers to upload files');
return;	
}
	
document.querySelector('[id="uploader"]').click();

}

/************/
	
async function handleUpload(event) {
	
let data = Array.from(event.target.files);

for(var i=0;i<data.length;i++) {
if(data[i].type != 'image/jpeg' && data[i].type != 'image/png' && data[i].type != 'image/jpg') {
event.target.value="";
setShowError(['show']);
setShowErrorMSG('Only jpg & png files allowed');
return;	
}

}

let folderName=data[0].webkitRelativePath.split('/')[0].trim();

let json = JSON.stringify(images);
json=JSON.parse(json);

for(var j=0; j<data.length; j++)
await readFileAsync(data[j],json,folderName);

setImages(json);

event.target.value="";

}

/************/

return (
<>

{showError.length>0 &&
<>
<Error props={{showMSG:showMSG, setShowError:setShowError }}/>
</>
}


{showPreview.length>0 &&
<>
<Modal props={{nft:nft, setNft:setNft, setShowPreview:setShowPreview }}/>
</>
}

{showGenerate.length>0 &&
<>
<Generate props={{w:imageWidth, h:imageWidth, images:images, setShowGenerate:setShowGenerate}} />
</>
}

<Container style={{padding:"0", margin:"0"}}>

<Row style={{width:"100vw", height:"100%"}}>

<Col sm={3} className="mt-3">

<InputGroup className="mt-3 mb-3">
<Form.Control data-id="name_txt" type="text" placeholder="Add Layer" defaultValue={''} onChange={handleLayerName} style={{height:"40px"}}/>
<Button style={{color:"white"}} variant="primary" onClick={addLayer}>
+</Button>
</InputGroup>

{images.data.length > 0 &&
<hr></hr>
}

{images.data.length > 0 &&
<>
<DragDropContext onDragEnd={handleDrop}>
<Droppable droppableId="droppable">
{(provided) => (
<div
className="droppable"
{...provided.droppableProps}
ref={provided.innerRef}
>

{images.data.map((image, index) => (
<Draggable key={image.name} draggableId={`draggable-${image.name}`} index={index}>
{(provided) => (
				
				
<div
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
className="mb-2"

>

<div className="d-grid gap-23" data-id={`div-${image.name}`} style={{ width:"100%", marginBottom:"0px",padding:"0px",border:currLayer==image.name ? "dashed 2px" : "0px", borderColor:currLayer==image.name ? "#ffffff" : "", borderRadius: "8px", opacity: currLayer==image.name ? "1" : "1"}} >

<InputGroup style={{}} className="mb-0" data-id={`text-${image.name}`} onClick={selectLayer}>

<OverlayTrigger placement="right" overlay={tooltip}>
<span data-id={`text-${image.name}`} class="list_span" style={{width:"75%",height:"40px", backgroundColor:'white', color:"#969494"}}>{image.name}</span>
 </OverlayTrigger>

<Button style={{width:"12.5%",color:"white"}} variant="danger" data-id={`delete-${image.name}`} onClick={deleteLayer}>
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
</svg>
</Button>

<Button style={{width:"12.5%",color:"white"}} variant="outline-secondary" data-id={`edit-${image.name}`} onClick={editLayer}>
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
</Button>

</InputGroup>

</div>


<div className="d-grid gap-23 d-none" data-id={`edit-div-${image.name}`} style={{ width:"100%", marginBottom:"0px"}}>
<InputGroup className="mb-0">
<Form.Control type="text" placeholder="Layer Name" defaultValue={image.name} data-id={`edit-text-${image.name}`} onClick={selectLayer} style={{height:"40px", backgroundColor:'white', color:"black"}} maxLength={20} />
<Button style={{color:"white"}} variant="danger" data-id={`cancel-${image.name}`} onClick={cancelLayer}>
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16"><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/></svg>
</Button>
<Button style={{color:"white"}} variant="outline-secondary" data-id={`update-${image.name}`} onClick={updateLayer}>
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
</svg>
</Button>
</InputGroup>
</div>

</div>

)}
</Draggable>
))}
{provided.placeholder}
</div>
)}
</Droppable>
</DragDropContext>
</>
}

<hr></hr>

<div style={{marginTop:"10px"}}>
<Button size="" style={{width:"100%", marginBottom:"5px"}} variant="warning" onClick={preview}>Quick Preview</Button>

<Button size="" style={{width:"100%"}} variant="primary" onClick={generate}>Generate Collection</Button>
</div>


</Col>

<Col sm={8} style={{marginTop:"20px"}}>

<div class="img_row" style={{border:"1px", height:"420px", overflowY: "auto", borderStyle: "dashed", borderColor:"#999", borderRadius: "0px", backgroundColor:'transparent'}}> 
<div class="column">

{images.data.map((image) => (							 
image.name==currLayer && image.files.length>0 && 							 
<>
{image.files.map((file) => (
<div style={{display:"inline-block", maxWidth:"150px", maxHeight:"150px", position:"relative", margin:"5px", backgroundColor:"white",borderRadius:"5px", borderColor:"#ffffff", border:"2px"}}>
<img id={file.id} src={file.src} style={{padding:'2px', maxWidth:"150px", maxHeight:"200px"}} />
<Button size="sm" className="img_btn" variant="primary" data-id={`delete-${file.id}`} onClick={deleteImage}>x</Button>
</div>
))}
<br/><br/><br/>
</>
))}

</div>
</div>

<Form.Group className="mb-3" style={{display:"none"}}>
<Form.Control type="file" multiple webkitdirectory="true" id="uploader" accept="image/jpeg, image/png, image/jpg" onChange={handleUpload}  size="lg" style={{width:"100%"}}/>
</Form.Group>



<InputGroup className="mb-3 mt-2">
<Button size="lg" style={{color:"white",fontSize:"0.80em", width:"40%", height:"40px"}} variant="primary" onClick={initiateUpload}>Upload Folder</Button>
<Button size="lg" variant="warning" style={{fontSize:"0.80em", width:"60%", height:"40px"}} onClick={initiateUpload}>Click here to add layers</Button>
</InputGroup>

</Col>
</Row>
</Container>
</>
);
}

export default NFTGenerator;