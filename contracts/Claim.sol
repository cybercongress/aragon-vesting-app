pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";


contract Claim is AragonApp {

    /// Events
    event NewLock(uint256 vestingId, address indexed lockAddress, uint256 amount);
    event NewProof(uint256 vestingId, string proofTx);

    /// State
    TokenManager public tokenManager;
    uint64 public vestingEnd;
    bool public paused;
    mapping (uint256 => string) public proofs;

    /// ACL
    bytes32 constant public PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 constant public PROOF_ROLE = keccak256("PROOF_ROLE");

    /// ERRORS
    string private constant ERROR_LOCK_ON_PAUSE = "LOCK_ON_PAUSE";
    string private constant ERROR_PROOF_EXIST = "PROOF_EXIST";

    function initialize(address _tokenManager, uint64 _vestingEnd) public onlyInit {
        // require(_vestingEnd > getTimestamp64(), "Lock end should be in future");
        tokenManager = TokenManager(_tokenManager);
        vestingEnd = _vestingEnd;
        paused = false;
        initialized();
    }

    /**
     * @notice Lock `amount` tokens till the end of action and claim `amount` CYBs
     * @param amount Amount to lock and claim
     * @return vesting ID
     */
    function lock(uint256 amount) public returns (uint256) {
        require(paused == false, ERROR_LOCK_ON_PAUSE);

        tokenManager.burn(msg.sender, amount);
        tokenManager.issue(amount);

        // vesting timings for debug
        uint64 start = getTimestamp64();
        uint64 cliff = getTimestamp64() + uint64(500);
        uint64 end = getTimestamp64() + uint64(1000);
        uint256 vestingId = tokenManager.assignVested(msg.sender, amount, start, cliff, end, false);

        // assert supply

        emit NewLock(vestingId, msg.sender, amount);

        return vestingId;
    }

    function addProof(uint256 _vestingId, string _proofTx) public auth(PROOF_ROLE) {
        // require(proofs[_vestingId] == "", ERROR_PROOF_EXIST);
        proofs[_vestingId] = _proofTx;

        emit NewProof(_vestingId, _proofTx);
    }

    function pause() public auth(PAUSE_ROLE) {
        paused = true;
    }

    function unpause() public auth(PAUSE_ROLE) {
        paused = false;
    }
}
