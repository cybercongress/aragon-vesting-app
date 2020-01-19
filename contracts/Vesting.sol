pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";


contract Vesting is AragonApp {

    /// Events
    event NewLock(uint256 vestingId, address indexed lockAddress, uint256 amount, string account);
    event NewProof(uint256 vestingId, string proofTx);
    event Pause(bool state);

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
    string private constant ERROR_WRONG_ACCOUNT = "WRONG_ACCOUNT";
    string private constant ERROR_PAST_END = "PAST_END";

    function initialize(address _tokenManager, uint64 _vestingEnd) public onlyInit {
        require(_vestingEnd > getTimestamp64(), ERROR_PAST_END);
        tokenManager = TokenManager(_tokenManager);
        vestingEnd = _vestingEnd;
        paused = false;
        initialized();
    }

    /**
     * @notice Vest `amount` GOLs till the end of action and create proposal to claim `amount` EULs
     * @return vesting ID
     */
    function lock(uint256 amount, string memory account) public returns (uint256) {
        require(paused == false, ERROR_LOCK_ON_PAUSE);

        bytes memory accountBytes = bytes(account);
        require(accountBytes.length == 44, ERROR_WRONG_ACCOUNT); // cyber1arvngwny4zxlk2xgzwjvt0w8l78yqr5tvnmue5

        tokenManager.burn(msg.sender, amount);
        tokenManager.issue(amount);

        uint256 vestingId = tokenManager.assignVested(msg.sender, amount, getTimestamp64(), vestingEnd, vestingEnd, false);
        transfers[vestingId] = account;

        emit NewLock(vestingId, msg.sender, amount, account);

        return vestingId;
    }

    function addProof(uint256 _vestingId, string memory _proofTx) public auth(PROOF_ROLE) {
        proofs[_vestingId] = _proofTx;

        emit NewProof(_vestingId, _proofTx);
    }

    function pause() public auth(PAUSE_ROLE) {
        paused = true;

        emit Pause(true);
    }

    function unpause() public auth(PAUSE_ROLE) {
        paused = false;

        emit Pause(true);
    }
}
