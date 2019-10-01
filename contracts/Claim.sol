pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";


contract Claim is AragonApp {

    /// Events
    event NewLock(uint256 vestingId, address indexed lockAddress, uint256 amount);

    /// State
    MiniMeToken public token; // Debug. Remove token
    TokenManager public tokenManager;
    uint64 public vestingEnd;
    bool public paused;

    /// ACL
    bytes32 constant public PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 constant public LOCK_ROLE = keccak256("LOCK_ROLE");

    /// ERRORS
    string private constant ERROR_ACTION_ON_PAUSE = "LOCK_ON_PAUSE";

    function initialize(address _token, address _tokenManager, uint64 _vestingEnd) public onlyInit {
        // require(_vestingEnd > getTimestamp64(), "Lock end should be in future");
        token = MiniMeToken(_token);
        tokenManager = TokenManager(_tokenManager);
        vestingEnd = _vestingEnd;
        paused = false;
        initialized();
    }

    /**
     * @notice Lock `amount` tokens till the end of action and claim `amount` CYBs
     * @param amount Amount to lock and claim
     */
    function lock(uint256 amount) external auth(LOCK_ROLE) {
        require(paused == false, ERROR_ACTION_ON_PAUSE);

        tokenManager.burn(msg.sender, amount);
        tokenManager.issue(amount);

        // lock timings for debug
        uint64 start = getTimestamp64();
        uint64 cliff = getTimestamp64() + uint64(500);
        uint64 end = getTimestamp64() + uint64(1000);
        uint256 vestingId = tokenManager.assignVested(msg.sender, amount, start, cliff, end, false);

        emit NewLock(vestingId, msg.sender, amount);
    }

    function pause() external auth(PAUSE_ROLE) {
        paused = true;
    }

    function unpause() external auth(PAUSE_ROLE) {
        paused = false;
    }

    // Debug. Remote this, call token manager contract directly from app
    function transferableBalanceOf(address _holder) public view returns (uint256) {
        return tokenManager.spendableBalanceOf(_holder);
    }

    // Debug. Remote this, call token contract directly from app
    function balanceOf(address _holder) public view returns (uint256) {
        return token.balanceOf(_holder);
    }
}
