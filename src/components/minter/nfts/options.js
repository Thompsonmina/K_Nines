import React, { useState, useEffect } from "react";
import skullImg from "../../../assets/img/dead.svg";
import PropTypes from "prop-types"; //Row
import { Card, Col, Row, ProgressBar, Button } from "react-bootstrap";

const Options = ({ other_qualia, pet, feed, revive, units }) => {
  const { last_pet, last_fed, index } = other_qualia;
  const [fedPercent, setFedPercent] = useState(0);
  const [petPercent, setPetPercent] = useState(0);
  const [isDead, setIsDead] = useState(false)

  console.log(last_fed, last_pet, "horah")


  

  useEffect(() => {
    const calc_percent = async (time_of_last_action, setter) => {

      const stateUnit = Number(units["stateUnit"] ) 
      const current = Math.round(Date.now() / 1000);
  
      const diff = (stateUnit + Number(time_of_last_action)) - current
      console.log(diff)
  
      if (diff < 0) setter(0)
      else{
        setter((diff / stateUnit ) * 100)
      }
    }
    calc_percent(last_fed, setFedPercent)
    calc_percent(last_pet, setPetPercent)

  }, [last_fed, last_pet, units]);

  useEffect(() => {
    const is_dead = async (last_fed, setter) => {

      const stateUnit = Number(units["deathUnit"] ) 
      const current = Math.round(Date.now() / 1000);
  
      setIsDead((stateUnit + Number(last_fed)) < current)

    }
    is_dead(last_fed)
  }, [last_fed, units]);


  return (! isDead ? <>
          <Card.Text className="flex-grow-1">
        <div>
        <ProgressBar variant={fedPercent > 51 ? "success": "danger"} now={fedPercent} label={"Hunger"} />
        </div>
        
        <div>
              <ProgressBar variant={fedPercent > 51 ? "success": "danger"} now={petPercent} label={"Happiness"} />
        </div>
            {/* </Stack> */}
          </Card.Text>
          <div>
            <Row className="mt-2">
                <Col key={"test"}>
                <Button onClick={() => feed(index)} variant="primary">Feed</Button>{' '}
              </Col>
              <Col key={"second"}>
              <Button onClick={() => pet(index)} variant="primary">Pet</Button>{' '}
                </Col>
            </Row>
          </div></> :
    <>
          <Card.Text className="flex-grow-1">
            {/* <Badge bg="secondary"> Dead </Badge> */}
            <div>
          <img src={skullImg} alt={"dead"} style={{ width: 32, height: "auto", color: "red"}} />
            </div>
            {/* </Stack> */}
          </Card.Text>
          <div>
            <Row className="mt-2">
                <Col key={"test"}>
                <Button onClick={() => revive(index)} variant="danger">Revive</Button>
              </Col>
            </Row>
          </div>
          </>
  );
};

Options.propTypes = {
  // props passed into this component
  other_qualia: PropTypes.instanceOf(Object).isRequired,
};

export default Options;
