import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import ImageGallery from 'react-image-gallery';
import '../css/image-gallery.css';
import Navbar from 'react-bootstrap/Navbar';

const Dialog = ( {props} ) => {
	
return (
<>

<Modal show={true} style={{backgroundColor:"black"}} fullscreen={true}>

<Navbar bg="dark" variant="dark">
<Container style={{float:"right"}}>
<Navbar.Brand>
NFT Collection Generator - Preview
</Navbar.Brand>

<Button size="lg" variant="outline-info" style={{color:"#fff", float:"right"}} onClick={() => props.setShowPreview([])}>x</Button>

</Container>
</Navbar>

<Modal.Body className="show-grid" style={{backgroundColor: "#272D37"}}>
<Container style={{maxWidth:"100%",backgroundColor: "#272D37"}}>

<Row style={{width:"100%"}}>

<Col style={{maxWidth:"100%"}}>
<ImageGallery items={props.nft} />
</Col>

</Row>

</Container>
</Modal.Body>


</Modal>
</>
);
}

export default Dialog;