// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IZKVerifier.sol";

/**
 * @title ZeroVault
 * @dev Main contract for the ZeroVault system that manages user registrations,
 * document references, and permissions.
 */
contract ZeroVault {
    // Structs
    struct User {
        bytes32 identityCommitment; // ZK identity commitment
        bool exists;
        uint256 registeredAt;
    }
    
    struct Document {
        bytes32 documentHash;    // Hash of the IPFS CID
        string documentType;     // Type of document (ID, passport, etc.)
        uint256 uploadedAt;
        bool exists;
    }
    
    struct Permission {
        address grantedTo;       // Address that has permission to verify
        uint256 expiresAt;       // Timestamp when permission expires
        string[] documentTypes;  // Types of documents that can be verified
        bool exists;
    }
    
    // State variables
    mapping(address => User) public users;
    mapping(address => mapping(bytes32 => Document)) public documents;
    mapping(address => bytes32[]) public userDocuments;
    mapping(address => mapping(address => Permission)) public permissions;
    mapping(address => address[]) public userPermissions;
    
    IZKVerifier public zkVerifier;
    
    // Events
    event UserRegistered(address indexed userAddress, bytes32 identityCommitment);
    event DocumentAdded(address indexed userAddress, bytes32 documentHash, string documentType);
    event PermissionGranted(address indexed from, address indexed to, uint256 expiresAt);
    event PermissionRevoked(address indexed from, address indexed to);
    
    // Constructor
    constructor(address _zkVerifier) {
        zkVerifier = IZKVerifier(_zkVerifier);
    }
    
    // Functions
    
    /**
     * @dev Register a new user with their identity commitment
     * @param _identityCommitment The ZK identity commitment of the user
     */
    function registerUser(bytes32 _identityCommitment) external {
        require(!users[msg.sender].exists, "User already registered");
        
        users[msg.sender] = User({
            identityCommitment: _identityCommitment,
            exists: true,
            registeredAt: block.timestamp
        });
        
        emit UserRegistered(msg.sender, _identityCommitment);
    }
    
    /**
     * @dev Add a document reference to the user's vault
     * @param _documentHash Hash of the IPFS CID where the encrypted document is stored
     * @param _documentType Type of the document
     */
    function addDocument(bytes32 _documentHash, string calldata _documentType) external {
        require(users[msg.sender].exists, "User not registered");
        require(!documents[msg.sender][_documentHash].exists, "Document already exists");
        
        documents[msg.sender][_documentHash] = Document({
            documentHash: _documentHash,
            documentType: _documentType,
            uploadedAt: block.timestamp,
            exists: true
        });
        
        userDocuments[msg.sender].push(_documentHash);
        
        emit DocumentAdded(msg.sender, _documentHash, _documentType);
    }
    
    /**
     * @dev Grant permission to another address to verify specific document types
     * @param _to Address to grant permission to
     * @param _expiresAt Timestamp when the permission expires
     * @param _documentTypes Array of document types that can be verified
     */
    function grantPermission(
        address _to, 
        uint256 _expiresAt, 
        string[] calldata _documentTypes
    ) external {
        require(users[msg.sender].exists, "User not registered");
        require(_to != address(0), "Invalid address");
        require(_expiresAt > block.timestamp, "Expiration must be in the future");
        
        if (!permissions[msg.sender][_to].exists) {
            userPermissions[msg.sender].push(_to);
        }
        
        permissions[msg.sender][_to] = Permission({
            grantedTo: _to,
            expiresAt: _expiresAt,
            documentTypes: _documentTypes,
            exists: true
        });
        
        emit PermissionGranted(msg.sender, _to, _expiresAt);
    }
    
    /**
     * @dev Revoke permission from an address
     * @param _from Address to revoke permission from
     */
    function revokePermission(address _from) external {
        require(permissions[msg.sender][_from].exists, "Permission does not exist");
        
        delete permissions[msg.sender][_from];
        
        // Remove from the array (this is a simple implementation, not gas-efficient)
        for (uint256 i = 0; i < userPermissions[msg.sender].length; i++) {
            if (userPermissions[msg.sender][i] == _from) {
                // Replace with the last element and pop
                userPermissions[msg.sender][i] = userPermissions[msg.sender][userPermissions[msg.sender].length - 1];
                userPermissions[msg.sender].pop();
                break;
            }
        }
        
        emit PermissionRevoked(msg.sender, _from);
    }
    
    /**
     * @dev Verify a user's identity using a zero-knowledge proof
     * @param _proof The zero-knowledge proof
     * @param _publicInputs The public inputs for the verification
     * @return True if the verification is successful
     */
    function verifyIdentity(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool) {
        return zkVerifier.verifyProof(_proof, _publicInputs);
    }
    
    /**
     * @dev Check if a user has permission to verify a specific document type
     * @param _owner The address of the document owner
     * @param _verifier The address of the verifier
     * @param _documentType The type of document to check permission for
     * @return True if the verifier has permission
     */
    function hasPermission(
        address _owner,
        address _verifier,
        string calldata _documentType
    ) external view returns (bool) {
        Permission storage permission = permissions[_owner][_verifier];
        
        if (!permission.exists || permission.expiresAt < block.timestamp) {
            return false;
        }
        
        for (uint256 i = 0; i < permission.documentTypes.length; i++) {
            if (keccak256(bytes(permission.documentTypes[i])) == keccak256(bytes(_documentType))) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @dev Get all documents for a user
     * @param _user The address of the user
     * @return Array of document hashes
     */
    function getUserDocuments(address _user) external view returns (bytes32[] memory) {
        return userDocuments[_user];
    }
    
    /**
     * @dev Get all permissions granted by a user
     * @param _user The address of the user
     * @return Array of addresses that have permission
     */
    function getUserPermissions(address _user) external view returns (address[] memory) {
        return userPermissions[_user];
    }
}
