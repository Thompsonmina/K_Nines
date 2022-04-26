import { useContractKit } from "@celo-tools/use-contractkit";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddNfts from "./Add";
import Nft from "./Card";
import Loader from "../../ui/Loader";
import { NotificationSuccess, NotificationError } from "../../ui/Notifications";
import {
  getNfts,
  createNft,
  pet_k_nine,
  feed_k_nine,
  revive_k_nine,
  fetchUnitStates,
} from "../../../utils/minter";
import { Row, Button } from "react-bootstrap";

import happy from "../../../assets/happy_puppy_barks.wav";
import hunger from "../../../assets/hungry_puppy.wav";


const NftList = ({ minterContract, name }) => {
    const { performActions, address } = useContractKit();
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState({})
    const [onlyMine, setOnlyMine] = useState(false)

    

    const getAssets = useCallback(async () => {
        try {
          setLoading(true);
          const allNfts = await getNfts(minterContract);
          if (!allNfts) return;
          const units = await fetchUnitStates(minterContract)
          setUnits(units)
          setNfts(allNfts);
        } catch (error) {
          console.log({ error });
        } finally {
          setLoading(false);
        }
    }, [minterContract]);
  
    // const fetchStates = useCallback(async () => {
      
    //   if (minterContract) {
    //     console.log("here")
    //     const states = 
    //     console.log(states)
    //     return states
    //   }
    // }, [minterContract])

    const addNft = async (data) => {
        try {
            setLoading(true);
            await createNft(minterContract, performActions, data);
            toast(<NotificationSuccess text="Updating K_nines...." />);
            getAssets();
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to create K_nine. Try Again" />);
        } finally {
            setLoading(false);
        }
    };

    const petK9 = async (index) => {
      try {
            setLoading(true);
            await pet_k_nine(minterContract, performActions, index);
            toast(<NotificationSuccess text="Your K_nine is happy...." />);
            console.log(happy)
            new Audio(happy).play();
            getAssets();
        } catch (error) {
          console.log({ error });
          toast(<NotificationError text="Failed to Pet, try again" />);
      } finally {
          setLoading(false);
     }
    }
  
    const feedK9 = async index => {
      try {
            setLoading(true);
            await feed_k_nine(minterContract, performActions, index);
            toast(<NotificationSuccess text="Your K_nine is fed...." />);
            new Audio(hunger).play();
            getAssets();
        } catch (error) {
          console.log({ error });
          toast(<NotificationError text="Failed to feed k_nine, try again" />);
      } finally {
          setLoading(false);
     }
    }
  
  const reviveK9 = async index =>{
    try {
            setLoading(true);
            await revive_k_nine(minterContract, performActions, index);
            toast(<NotificationSuccess text="K_nine successfully revived be better " />);
            getAssets();
        } catch (error) {
          console.log({ error });
          toast(<NotificationError text="Failed to revive K9, try again" />);
      } finally {
          setLoading(false);
      }
    }
      
      useEffect(() => {
        try {
          if (address && minterContract) {
            getAssets();
          }
        } catch (error) {
          console.log({ error });
        }
      }, [minterContract, address, getAssets]);
  

      
      if (address) {
        return (
          <>
            {!loading ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Button variant="link" onClick={() => {setOnlyMine(false)}}><h1 className="fs-4 fw-bold mb-0 text-dark">{name}</h1> </Button>
                  <Button variant="link" onClick={() => setOnlyMine(true)}><h1 className="fs-4 fw-bold mb-0 text-dark">{"My K_Nines 🐕"}</h1> </Button>
                  {
                    <AddNfts save={addNft} address={address} />
                  }
                </div>
                <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                  { ! onlyMine ? nfts.map((_nft) => (
                    <Nft
                      key={_nft.index}
                      nft={{
                        ..._nft,
                      }}
                      pet={petK9}
                      feed={feedK9}
                      units={units}
                      revive={reviveK9}
                      client_address={address}
                    />
                  )) :
                  nfts.filter(_nft => _nft.owner === address ).map((_nft) => (
                    <Nft
                      key={_nft.index}
                      nft={{
                        ..._nft,
                      }}
                      pet={petK9}
                      feed={feedK9}
                      units={units}
                      revive={reviveK9}
                      client_address={address}

                    />
                  ))
                  }
                  {console.log(onlyMine)}
                </Row>
              </>
            ) : (
              <Loader />
            )}
          </>
        );
      }
      return null;
    
}

NftList.propTypes = {
    minterContract: PropTypes.instanceOf(Object),
    updateBalance: PropTypes.func.isRequired,
  };
  
NftList.defaultProps = {
    minterContract: null,
};
  
export default NftList;