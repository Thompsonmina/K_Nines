import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


const AddNfts = ({ save, address }) => {
    const [name, setName] = useState("");
    const [show, setShow] = useState(false);

    // check if all form data has been filled
  const isFormFilled = () =>
  name.length >= 2;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
  };

  // display the popup modal
  const handleShow = () => setShow(true);
    
  return (
    <>
      <Button
        onClick={handleShow}
        variant="link"
        className="rounded-pill px-2 py-2"
      >
        <h1 className="fs-4 fw-bold mb-0 text-dark">{"Get a K_nine 🐾"}</h1> 
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Get a K_nine 🐾</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputLocation"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of NFT"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FloatingLabel>           
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                name,
              });
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;