import React from "react";
import PropTypes from "prop-types"; //Row
import {
  Card,
  Col,
  Badge,
  Stack,
  Row,
  ProgressBar,
  Button,
} from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";
import Options from "./options";

const NftCard = ({ nft, pet, feed, revive, units, client_address }) => {
  const { image, owner, name, index, last_fed, last_pet } = nft;

  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={name} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>

          {client_address === owner ? (
            <Options
              other_qualia={{
                last_pet: last_pet,
                last_fed: last_fed,
                index: index,
              }}
              pet={pet}
              feed={feed}
              units={units}
              revive={revive}
            />
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;
