// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract Base is ERC721, ERC721Enumerable, Ownable {

    uint16 FOREVER_MAX_SUPPLY = 1028;
    uint16 current_supply = 256;

    constructor() ERC721("K_nine", "k9") {}

    function increase_supply(uint16 new_supply) public onlyOwner{
        require(new_supply > current_supply);
        require(new_supply <= FOREVER_MAX_SUPPLY);
        current_supply = new_supply;

    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }


    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

contract K_nine is Base{
    using Counters for Counters.Counter;

    uint public revive_price; 
    Counters.Counter internal _tokenIdCounter;

    enum Unit {wk, day, hr, min, sec}
    mapping (Unit => uint) unit_map;

    struct dog_state{
        uint last_pet;
        uint last_fed;
        string name;
    }

    uint public death_unit;
    uint public state_unit;

    uint NONCE;

    constructor (Unit d_unit, Unit s_unit, uint d_num, uint s_num, uint rev_price) {
        unit_map[Unit.wk] = 1 weeks;
        unit_map[Unit.day] = 1 days;
        unit_map[Unit.hr] = 1 hours;
        unit_map[Unit.min] = 1 minutes;
        unit_map[Unit.sec] = 1 seconds;
        death_unit = d_num * unit_map[d_unit]; 
        state_unit = s_num  * unit_map[s_unit];

        revive_price = rev_price * (10 ** 18);
        NONCE = random(block.timestamp) % 100;
    }

    string[] private background_colors = [ "#e4dcf1","2f97c1", "a42cd6", "85ff9e","89f7fe", "66a6ff", "feada6", "f5efef" 
        "cfd9df", "e2ebf0", "eeeeee" "dddddd", "cccccc", "9f8f8", "0f0326"
    ];
    string[] private face_colors = ["8d5524", "ECCBD9", "d11141", "00b159", "00aedb", "f37735", "ffc425", "fe4a49",
        "2ab7ca", "de6e4b", "b7990d", "110B11", "8f7e4f", "adacb5", "ffdbac", "3d1e6d", "8874a3" 
    ];
    string[] private parts_colors = ["dd0426", "080705", "e2d4b7", "dd2d4a", "dd2d4a", "2a2a72", "ffe548", "1f1a38", "0a0908", "293f14"];

    mapping (uint => dog_state) dogs;


    function random(uint input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function is_hungry(uint id) public view returns (bool) {
        return block.timestamp > dogs[id].last_fed + state_unit;
    }

    function is_happy(uint id) public view returns(bool){
        return block.timestamp < dogs[id].last_pet + state_unit;
    }

    function is_dead(uint id) public view returns (bool){
        return block.timestamp > dogs[id].last_fed + death_unit;
    }

    function revive(uint id) public payable{
        require(ownerOf(id) == msg.sender, "you do not own this doggo");
        require(is_dead(id), "your doggo is very much alive");
        require(msg.value >= revive_price, "revival price to low");

        dogs[id].last_fed = block.timestamp;

    }

    function feed_doggo(uint id) public {
        require(ownerOf(id) == msg.sender, "you do not own this doggo");
        require(! is_dead(id));

        dogs[id].last_fed = block.timestamp;

    }

    function pet_doggo(uint id) public{
        require(ownerOf(id) == msg.sender, "you do not own this doggo");
        require(! is_dead(id));

        dogs[id].last_pet = block.timestamp;
    }

    function create_k9(string memory name) public {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _tokenIdCounter.increment();
        
        
        dogs[tokenId] = dog_state(block.timestamp, block.timestamp, name);
    }

    function get_background(uint id) private view returns (string memory){
        uint background_index = random(id + NONCE) % background_colors.length;
        return string(abi.encodePacked("<rect width='2048' height='2e3' fill='#", background_colors[background_index], "'/>"));
    }

    function get_head(uint id) private view returns (string memory){
        uint head_index = random(id + NONCE) % face_colors.length;

        return string(abi.encodePacked("<path d='m1443 984.5c0 232.79-192.07 421.5-429 421.5s-429-188.71-429-421.5c0-232.79 192.07-421.5 429-421.5s429 188.71 429 421.5z' fill='#",
        face_colors[head_index], "'/>"));
    }

    function get_ears(uint id) private view returns (string memory){
        uint ear_index = random(id + NONCE + 1) % face_colors.length;
        string memory ear1 = string(abi.encodePacked("<path d='m599.2 981.09c-59.205 145.04-179.35 174.98-243.56 145.04-69.507-22.99-90.959-77.74-51.935-191.3 4.451-39.189 31.395-68.316 53.354-121.8 57.619-140.32 98.416-160.35 164.35-134.61 221.37 68.603 222.59 50.572 77.794 302.66z' fill='#",
        face_colors[ear_index],"'/>"));
        string memory ear2 = string(abi.encodePacked("<path d='m1462.7 1008.7c59.21 145.03 179.35 174.98 243.57 145.03 69.5-22.99 90.96-77.74 51.93-191.3-4.45-39.189-31.39-68.317-53.35-121.8-57.62-140.32-98.42-160.35-164.35-134.61-221.38 68.603-222.59 50.572-77.8 302.67z' fill='#",
        face_colors[ear_index],"'/>"));
        return string(abi.encodePacked(ear1, ear2));
    }

    function get_face(uint id) private view returns (string memory){
        string memory mouth;
        string memory eyes;
        string memory face_color = parts_colors[random(id + NONCE) % parts_colors.length];

        if (is_happy(id) && ! is_hungry(id)){
            mouth = string(abi.encodePacked("<path d='m1007 1104v67.49m-72-6.5 6.44 9.17c4.28 6.09 10.24 10.8 17.15 13.57 2.93 1.17 5.99 1.97 9.11 2.4 8.92 1.2 17.97-0.77 25.58-5.56l1.72-1.08 11.5-12 7.51 8.72c5.16 6 12.27 9.98 20.07 11.25 6.16 1 12.47 0.27 18.24-2.11l1.2-0.5c8.38-3.46 15.25-9.79 19.4-17.85l3.08-6.01' stroke='#",
            face_color, "' stroke-width='8'/>'"));
        }
        else{
            mouth = string(abi.encodePacked("<path d='M1007 1104L1008 1166M1052 1218C1027.17 1137.97 980.269 1160.25 964 1218' stroke='#",face_color, "' stroke-width='8'/>'"));
        }
        
        if (is_dead(id)){
            eyes = string(abi.encodePacked("<path d='M775.497 833L927 955M775 955L926.503 833' stroke='#", face_color, "' stroke-width='8'/>",
            "<path d='M1078.5 833L1230 955M1078 955L1229.5 833' stroke='#", face_color, "' stroke-width='8'/>"));
        }
        else{
            eyes = string(abi.encodePacked("<path d='m887.34 906.1c-2.613 39.835-25.196 70.786-50.44 69.131-25.244-1.656-43.59-35.292-40.977-75.126 2.612-39.835 25.195-70.786 50.439-69.131 25.244 1.656 43.586 35.292 40.978 75.126z' fill='#",
                face_color, "'/>", "<path d='m1211.4 913.11c0 39.921-20.51 72.283-45.81 72.283s-45.8-32.362-45.8-72.283 20.5-72.283 45.8-72.283 45.81 32.362 45.81 72.283z' fill='#", 
                face_color, "'/>"
            ));
        }

        return string(abi.encodePacked(eyes, 
        "<path d='m1020.5 1097.9c-8.13 8.49-21.785 8.18-29.505-0.67l-49-56.11c-11.33-12.98-2.05-33.25 15.18-33.16 36.13 0.19 66.255 0.35 102.16 0.54 17.56 0.1 26.49 21.15 14.35 33.83l-53.18 55.57z' fill='#", face_color, "'/>",
        mouth));

    }

    function tokenURI(uint256 id) public
        view
        override(ERC721)
        returns (string memory){

        string memory image = string(abi.encodePacked(get_background(id),
        get_head(id), get_ears(id), get_face(id)));
        
        dog_state storage dog = dogs[id];

        image = string(abi.encodePacked("<?xml version='1.0' encoding='UTF-8'?>", 
        "<svg fill='none' viewBox='0 0 2048 2000' xmlns='http://www.w3.org/2000/svg'>", image, "</svg>"));
        
        string memory last_fed_in_hours = Strings.toString(dog.last_fed);
        string memory last_pet_in_hours = Strings.toString(dog.last_pet);

        string memory json = Base64.encode(bytes(string(abi.encodePacked("{'name': '", dog.name, "', 'last_fed':'",
        last_fed_in_hours, "', 'last_pet':'", last_pet_in_hours, "', 'image': '", 
        "data:image/svg+xml;base64,", Base64.encode(bytes(image)), "'}"))));

        return string(abi.encodePacked("data:application/json;base64,", json));
        
    }

}