import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { generateNFT } from '../modules/generateNFT';

const Generate = ({props}) => {

const [dropdownValue, setDropdownValue] = useState('ETHEREUM');
const [formatValue, setFormatValue] = useState('image/png');

const [collectionName, setCollectionName] = useState('');
const [collectionDesc, setCollectionDesc] = useState('');

const [symbolName, setSymbolName] = useState('');   
const [extUrlName, setExtUrlName] = useState('');   
const [animUrlName, setAnimUrlName] = useState('');
const [feePoints, setFeePoints] = useState(0);

/************/

const handleDropdownChange = (event) => {
setDropdownValue(event.target.value);
}

/************/

const handleFormatChange = (event) => {
setFormatValue(event.target.value);
}

/************/

const handleCollectionName = (event) => {
setCollectionName(event.target.value);
}

/************/

const handleCollectionDesc = (event) => {
setCollectionDesc(event.target.value);
}

/************/

const handleSymbolName = (event) => {
setSymbolName(event.target.value);
}

/************/
	   
const handleExtUrlName = (event) => {
setExtUrlName(event.target.value);
}

/************/
	   
const handleAnimUrlName = (event) => {
setAnimUrlName(event.target.value);
}

/************/

const handleFeePoints = (event) => {
setFeePoints(event.target.value);
}

/************/


const download = async(e) => {
	
e.preventDefault();	
	
const zip = new JSZip();

let w = props.w;
let h = props.h;

let mime=formatValue;
let ext='png';

if(mime=='image/jpg' || mime=='image/jpeg')
ext='jpg';

let result = await generateNFT(props.images,w,h,mime);
let layerName=props.images.data[0].name;

const metaFolder = zip.folder("Metadata");
const nftFolder = zip.folder("NFT-Collection");

for(var i=0;i<result.length;i++) {

if(result[i].original.indexOf('image/png')!=-1)	
var imgData=result[i].original.replace('data:image/png;base64,','');
else if(result[i].original.indexOf('image/jpg')!=-1)	
var imgData=result[i].original.replace('data:image/jpg;base64,','');
else if(result[i].original.indexOf('image/jpeg')!=-1)	
var imgData=result[i].original.replace('data:image/jpeg;base64,','');

let fileName = Number(i+1);
let meta = await MetaJSON(layerName,fileName+"."+ext,fileName);

nftFolder.file(fileName+"."+ext, imgData, {base64: true});
metaFolder.file(fileName+".json", JSON.stringify(meta));

}

zip.generateAsync({type:"blob"}).then(function(content) {
FileSaver.saveAs(content, collectionName.replaceAll(" ","-").toLowerCase()+"-nft.zip");
});

props.setShowGenerate([]);

}

/************/

function MetaJSON(layerName,fileName,index) {
return new Promise((resolve, reject) => {
										
let meta;					

switch (dropdownValue) {
case "ETHEREUM":
meta='{"title":"'+collectionName+'","type":"object","properties":{"'+layerName+'":{"type":"string","description":"'+layerName+' '+index+'"},"image":{"type":"string","description":"'+fileName+'"}}}';
resolve(JSON.parse(meta));
break;

case "OPENSEA-RARIBLE":
meta='{"name":"'+collectionName+'","description":"'+collectionDesc+'","external_image":"'+fileName+'","image":"'+fileName+'","attributes":{"'+layerName+'":{"type":"string","description":"'+layerName+' '+index+'"}}}';
resolve(JSON.parse(meta));
break;

case "SOLANA":
meta='{"name":"'+collectionName+'","symbol":"'+symbolName+'","description":"'+collectionDesc+'","image":"'+fileName+'","animation_url":"'+animUrlName+'","external_url":"'+extUrlName+'","seller_fee_basis_points":'+feePoints+',"attributes":[{"trait_type":"'+layerName+'","value":"'+layerName+' '+index+'"}]}';
resolve(JSON.parse(meta));

break;
}				

})
}

/************/

return (

<>

<Modal size="lg" show={true}>

<Modal.Header>
<Modal.Title>Generate Collection</Modal.Title>
<Button size="sm" variant="outline-info" style={{color:"#000", float:"right"}} onClick={() => props.setShowGenerate([])} >x</Button>
</Modal.Header>

<Modal.Body>

<Form onSubmit={download}>
		 
<Form.Group className="mb-3">
<Form.Control type="text" placeholder="Collection Name" value={collectionName} maxLength={100} onChange={handleCollectionName} style={{height:"50px"}} autoFocus required/>
</Form.Group>

<Form.Group className="mb-3">
<Form.Control as="textarea" rows={3} cols={23} maxLength={1000} value={collectionDesc} onChange={handleCollectionDesc} placeholder='Description' style={{}} required/>
</Form.Group>

{dropdownValue== "SOLANA" &&
<>

<Row className="mb-3">
<Col>
<Form.Control data-id="symbol_txt" type="text" placeholder="Collection Symbol (Enter symbol here)" value={symbolName} maxLength={100} onChange={handleSymbolName} style={{height:"50px",width:"100%"}} required/>
</Col>
<Col>
<Form.Control data-id="extend_url_txt" type="text" placeholder="Extend Url (Enter extend url here)" value={extUrlName} maxLength={100} onChange={handleExtUrlName} style={{height:"50px",width:"100%"}} required/>
</Col>
</Row>


<Row className="mb-3">
<Col>
<Form.Control data-id="animation_url_txt" type="text" placeholder="Animation Url (Enter animation url here)" value={animUrlName} maxLength={100} onChange={handleAnimUrlName} style={{height:"40px"}} required/>
</Col>
<Col>
<InputGroup style={{width:"100%"}}>
<Button style={{color:"black",fontSize:"0.85em", height:"40px"}} variant="outline-secondary">Seller Fee Basis Points</Button>
<Form.Control type="number" value={feePoints} onChange={handleFeePoints} step="1" style={{fontSize:"0.85em", height:"40px"}} required/>
</InputGroup>
</Col>
</Row>


</>
}



<InputGroup className="mb-3" style={{width:"100%"}}>
<Button style={{color:"black",fontSize:"0.85em", height:"40px"}} variant="outline-secondary">Metadata</Button>
<Form.Select value={dropdownValue} onChange={handleDropdownChange} required>
<option value="ETHEREUM">Ethereum</option>
<option value="OPENSEA-RARIBLE">Openseas / Rarible</option>
<option value="SOLANA">Solana / Metaplex</option>
</Form.Select>
</InputGroup>


<Form.Group className="mb-0">
<Form.Check style={{fontSize:"0.75em"}} onChange={handleFormatChange} type="radio"name="radio" inline label="PNG" value={'image/png'} defaultChecked />

<Form.Check style={{fontSize:"0.75em"}} onChange={handleFormatChange} type="radio"name="radio" inline label="JPG" value={'image/jpeg'}  />
</Form.Group>
<Button type="submit" style={{width:"100%"}} variant="primary" >
Generate
</Button>
</Form>



</Modal.Body>
		
		
		
<Modal.Footer>

</Modal.Footer>
		
</Modal>



</>
);
}

export default Generate;
