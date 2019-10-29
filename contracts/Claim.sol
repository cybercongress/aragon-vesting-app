pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";


contract Claim is AragonApp {

    /// Events
    event NewLock(uint256 vestingId, address indexed lockAddress, uint256 amount, string account);
    event NewProof(uint256 vestingId, string proofTx);

    /// State
    TokenManager public tokenManager;
    uint64 public vestingEnd;
    bool public paused;
    mapping (uint256 => string) public proofs;
    mapping (uint256 => string) public transfers;

    /// ACL
    bytes32 constant public PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 constant public PROOF_ROLE = keccak256("PROOF_ROLE");

    /// ERRORS
    string private constant ERROR_LOCK_ON_PAUSE = "LOCK_ON_PAUSE";
    string private constant ERROR_PROOF_EXIST = "PROOF_EXIST";
    string private constant ERROR_WRONG_ACCOUNT = "WRONG_ACCOUNT";

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
    function lock(uint256 amount, string memory account) public returns (uint256) {
        require(paused == false, ERROR_LOCK_ON_PAUSE);

        // account example cyber1arvngwny4zxlk2xgzwjvt0w8l78yqr5tvnmue5

        // TODO add prefix cyber validaton
        bytes memory accountBytes = bytes(account);
        require(accountBytes.length == 44, ERROR_WRONG_ACCOUNT);

        tokenManager.burn(msg.sender, amount);
        tokenManager.issue(amount);

        // vesting timings for debug
        uint64 start = getTimestamp64();
        uint64 cliff = getTimestamp64() + uint64(500);
        uint64 end = getTimestamp64() + uint64(1000);
        uint256 vestingId = tokenManager.assignVested(msg.sender, amount, start, cliff, end, false);
        transfers[vestingId] = account;

        // assert supply

        emit NewLock(vestingId, msg.sender, amount, account);

        return vestingId;
    }

    function addProof(uint256 _vestingId, string memory _proofTx) public auth(PROOF_ROLE) {
        // require(proofs[_vestingId] == , ERROR_PROOF_EXIST);
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
