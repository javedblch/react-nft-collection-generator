import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';

const Error = ( {props} ) => {
return (
<>

<Modal show={true} size="sm">

<Modal.Body><center>{props.showMSG}</center></Modal.Body>

<Modal.Footer>
<Button style={{width:"100%"}} variant="danger" onClick={() => props.setShowError([])}>Ok</Button>
</Modal.Footer>
</Modal>
</>
);
}

export default Error;