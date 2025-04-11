pragma circom 2.0.0;

include "circomlib/comparators.circom";
include "circomlib/poseidon.circom";

/*
 * Circuit to prove that a person is older than a certain age threshold
 * without revealing their actual age.
 * 
 * Inputs:
 * - birthYear: The year the person was born (private)
 * - currentYear: The current year (public)
 * - ageThreshold: The minimum age to verify (public)
 * 
 * Output:
 * - isOldEnough: 1 if the person is older than the threshold, 0 otherwise
 */
template AgeProof() {
    // Private inputs
    signal input birthYear;
    
    // Public inputs
    signal input currentYear;
    signal input ageThreshold;
    
    // Output
    signal output isOldEnough;
    
    // Calculate age
    signal age <== currentYear - birthYear;
    
    // Check if age is greater than or equal to threshold
    component greaterThanOrEqual = GreaterEqThan(32);
    greaterThanOrEqual.in[0] <== age;
    greaterThanOrEqual.in[1] <== ageThreshold;
    
    // Output the result
    isOldEnough <== greaterThanOrEqual.out;
    
    // Range check to ensure birthYear is reasonable (between 1900 and currentYear)
    component birthYearLowerBound = GreaterEqThan(32);
    birthYearLowerBound.in[0] <== birthYear;
    birthYearLowerBound.in[1] <== 1900;
    
    component birthYearUpperBound = LessThan(32);
    birthYearUpperBound.in[0] <== birthYear;
    birthYearUpperBound.in[1] <== currentYear;
    
    // These constraints will fail if the birth year is not within reasonable bounds
    birthYearLowerBound.out === 1;
    birthYearUpperBound.out === 1;
}

component main {public [currentYear, ageThreshold]} = AgeProof();
