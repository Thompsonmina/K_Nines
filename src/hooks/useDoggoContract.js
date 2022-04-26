import { useContract } from "./useContract";
import Doggo from "../contracts/Doggo.json";
import DoggoAddress from "../contracts/DoggoAddress.json";

// export interface for smart contract
export const useDoggoContract = () =>
  useContract(Doggo.abi, DoggoAddress.Doggo);
