// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract Certification {

    uint public certificate_counter;
    address public owner;
    address admin;

    //contructor
    constructor() {
        admin = 0x3084Ef65c0FDeD7F126E58Dee6F9C2f1BCF6f0d7;
        isIssuer[admin] = true;
        isIssuer[0xf19Cb762c455C3C8a21436e95DF0e67079993Cb4] = true;
    }

    //struct
    struct Certificate {
        string candidateName;
        string university;
        string acronym;
        string course;
        string ipfs_hash;
        string dateOfIssue;
    }

    //event
    event CertificateGenerated(bytes32 indexed _certificateId);
    event IssuerRegistered(address indexed _issuer, address _admin);

    //mapping
    mapping(bytes32 => Certificate) certificates;
    mapping(bytes32 => bool) verified;
    mapping(address => bool) isIssuer;

    //function
    function generateCertificate(
        string memory _id,
        string memory _candidateName,
        string memory _university,
        string memory _acronym,
        string memory _course,
        string memory _dateOfIssue,
        string memory _ipfs_hash 
    ) public {
        //require(isIssuer[msg.sender] == true, "You are not permitted");
        certificate_counter++;
        bytes32 byte_id = stringToBytes32(_id);
        verified[byte_id] = true;
        certificates[byte_id] = Certificate(_candidateName, _university, _acronym, _course, _ipfs_hash, _dateOfIssue);
        emit CertificateGenerated(byte_id);
    }

    function issuerRegister(address issuer) public {
        require(isIssuer[msg.sender] == true, "You are not permitted");
        isIssuer[issuer] = true;
        emit IssuerRegistered(issuer, msg.sender);
    }

    function isVerified(string memory _id) public view returns (bool) {
        bytes32 byte_id = stringToBytes32(_id);
        if (verified[byte_id]) {
            return true;
        }
        return false;
    }
    
    function getCertificate(string memory _id) public view returns (string memory, string memory, string memory, string memory, string memory, string memory) {
        bytes32 byte_id = stringToBytes32(_id);
        Certificate memory cert = certificates[byte_id];
        bytes memory tempEmptyStringNameTest = bytes(
            certificates[byte_id].dateOfIssue
        );
        require(
            tempEmptyStringNameTest.length != 0,
            "Certificate id does not exist"
        );
        return (cert.candidateName, cert.university, cert.acronym, cert.course, cert.ipfs_hash, cert.dateOfIssue);
    }

    function getIssuer(address _address) public view returns (bool) {
        return isIssuer[_address];
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
                result := mload(add(source, 32))
        }
    }

}