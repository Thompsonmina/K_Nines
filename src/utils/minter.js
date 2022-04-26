import BigNumber from "bignumber.js"


const format_data = uri => JSON.parse(atob(uri.split('base64,')[1]).replaceAll("'", '"'));


export const createNft = async (
    minterContract,
    performActions,
    { name }
  ) => {
    await performActions(async (kit) => {
      if (!name) return;
      const { defaultAccount } = kit;
  
      try {
        
        // mint the NFT
        let transaction = await minterContract.methods.create_k9(name)
          .send({ from: defaultAccount });
  
        return transaction;
      } catch (error) {
        throw error
      }
    });
};
  


  export const getNfts = async (minterContract) => {
    try {
      const nfts = [];
      console.log("oho")
      const nftsLength = await minterContract.methods.totalSupply().call();

      for (let i = 0; i < Number(nftsLength); i++) {
        const nft = new Promise(async (resolve) => {
          let meta = await minterContract.methods.tokenURI(i).call();
          meta = format_data(meta)
          console.log(meta)
          const owner = await fetchNftOwner(minterContract, i);
          
          resolve({
            index: i,
            owner,
            name: meta.name,
            image: meta.image,
            last_fed: meta.last_fed,
            last_pet: meta.last_pet
          });
        });
        nfts.push(nft);
      }
      return Promise.all(nfts);
    } catch (e) {
      throw e
    }
  };

  export const fetchNftOwner = async (minterContract, index) => {
    try {
      return await minterContract.methods.ownerOf(index).call();
    } catch (e) {
      throw e
    }
  };

  export const fetchUnitStates = async (minterContract) => {
    try {
      const stateUnit = await minterContract.methods.state_unit().call()
      const deathUnit = await minterContract.methods.death_unit().call()
      console.log("jajja")
      console.log(stateUnit, "---")
      return {stateUnit:stateUnit, deathUnit:deathUnit}
        
    } catch (e) {
      throw e
      }
    }

const revive_price = new BigNumber("4").shiftedBy(18)

  export const revive_k_nine = async (minterContract, performActions,index, price=revive_price) => {
    await performActions(async (kit) => {
      console.log(revive_price.toFixed(), "price")
      const { defaultAccount } = kit;
  
      try {
        
        let transaction = await minterContract.methods.revive(index)
          .send({
            from: defaultAccount
            , value: price.toString()
          });
  
        return transaction;
      }
      catch (error) {
        throw error
      }
    })
  }
  
  export const feed_k_nine = async (minterContract, performActions, index) => {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      try {
        let transaction = await minterContract.methods.feed_doggo(index)
          .send({ from: defaultAccount });
        
        return transaction
    }
    catch (e) {
      throw e
    }
      })
  }

  export const pet_k_nine = async (minterContract, performActions, index) => {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      try {
        let transaction = await minterContract.methods.pet_doggo(index)
        .send({from: defaultAccount})

        return transaction
    }
    catch (e) {
      throw e
    }
      })
  }
