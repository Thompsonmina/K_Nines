import React from "react";
import { Container, Nav} from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/Wallet";
import Cover from "./components/minter/Cover";
import Nfts from "./components/minter/nfts";
import { useBalance, useDoggoContract } from "./hooks";
import coverImg from "./assets/img/background.jpg";
import "./App.css";

const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();
  const { balance, getBalance } = useBalance();
  const minterContract = useDoggoContract();

  return (
    <> 
      <Notification />
      {address ? (
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              {/*display user wallet*/}
              <Wallet
                address={address}
                amount={balance.CELO}
                symbol="CELO"
                destroy={destroy}
              />
            </Nav.Item>

          </Nav>
          
          <main>
            <Nfts
              name="K_Nines 🐶"
              updateBalance={getBalance}
              minterContract={minterContract}
            />
          </main>
        </Container>
      ) : (
        <Cover name="K_nines" coverImg={coverImg} connect={connect} />
      )}
    </>
  );
};

export default App;