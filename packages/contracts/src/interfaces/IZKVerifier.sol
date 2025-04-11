// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title IZKVerifier
 * @dev Interface for zero-knowledge proof verifiers
 */
interface IZKVerifier {
    /**
     * @dev Verify a zero-knowledge proof
     * @param _proof The zero-knowledge proof
     * @param _publicInputs The public inputs for the verification
     * @return True if the verification is successful
     */
    function verifyProof(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool);
}
