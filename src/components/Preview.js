import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';

const Preview = ( {props} ) => {
	
return (
<>

<Modal show={true} style={{backgroundColor:"black"}} fullscreen={false}>

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
<Carousel>
{props.nft.map((image, index) => (
<div>
<img src={image.original} />
</div>
))}
</Carousel>
</Col>

</Row>

</Container>
</Modal.Body>


</Modal>
</>
);
}

export default Preview;