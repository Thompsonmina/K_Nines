const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("K_nine Collection", function () {
  this.timeout(50000);

  let NFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    NFT = await ethers.getContractFactory("K_nine");
    [owner, acc1, acc2] = await ethers.getSigners();

    nft = await NFT.deploy(0, 1, 1, 1, 2);
  });

  it("Should set the right owner", async function () {
    expect(await nft.owner()).to.equal(owner.address);
  });

  it("Should mint one NFT", async function () {
    expect(await nft.balanceOf(acc1.address)).to.equal(0);

    const tx = await nft.connect(acc1).create_k9("nate");
    await tx.wait();

    expect(await nft.balanceOf(acc1.address)).to.equal(1);
    expect(await nft.ownerOf(0)).to.equal(acc1.address);
  });

  it("Should create the  correct tokenURI", async function () {
    let dog_name = "kate";
    const tx = await nft.connect(acc1).create_k9(dog_name);
    await tx.wait();
    const tx3 = await nft.connect(acc2).create_k9("kenneth");
    await tx3.wait();

    let format_data = (uri) =>
      JSON.parse(atob(uri.split("base64,")[1]).replaceAll("'", '"'));

    let data = format_data(await nft.tokenURI(0));

    expect(await nft.totalSupply()).to.equal(2);
    expect(data.name).to.equal(dog_name);
  });

  it("Should be happy and not hungry at conception", async function () {
    const tx2 = await nft.connect(acc2).create_k9("dave");
    await tx2.wait();

    expect(await nft.is_happy(0)).to.equal(true);
    expect(await nft.is_hungry(0)).to.equal(false);
  });

  // Time is not working properly in hardhat fix later
  // it("K_9 Should be hungry and sad after it has not been fed and petted in time", async function () {

  //   const seconds_till_hunger_and_sad = 6
  //   altdog = await NFT.deploy(0, 4, 1, 1)
  //   const tx2 = await altdog.connect(acc2).create_k9("dave");
  //   await tx2.wait();

  //   console.log(await altdog.state_unit())
  //   await delay(seconds_till_hunger_and_sad * 1000)

  //   expect(await altdog.is_happy(0)).to.equal(false)
  //   expect(await altdog.is_hungry(0)).to.equal(true)
  // });

  it("K_9 revive price should be 4 celo", async function () {
    altdog = await NFT.deploy(4, 4, 0, 1, 4);
    const tx2 = await altdog.connect(acc2).create_k9("dave");
    await tx2.wait();

    expect((await altdog.revive_price()).toString()).to.equal(
      "4000000000000000000"
    );
  });

  it("K_9 revive method works as expected", async function () {
    // make the dog dead on creation
    altdog = await NFT.deploy(4, 4, 0, 0, 4);
    const tx1 = await altdog.connect(acc2).create_k9("dave");
    await tx1.wait();

    const tx2 = await altdog
      .connect(acc2)
      .revive(0, { value: BigNumber.from("4000000000000000000") });
    await tx2.wait();

    expect(await altdog.is_dead(0)).equals(false);
  });
});
