import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
return (
<>
<Navbar bg="dark" variant="dark" style={{float:"right",width:"100%"}}>
<Container>
<Navbar.Brand href="#home">
<img
alt=""
src="../logo.svg"
width="30"
height="30"
className="d-inline-block align-top"
/>{' '}
NFT Collection Generator - ReactJS
</Navbar.Brand>
</Container>
</Navbar>
</>
)
}

export default Header;
