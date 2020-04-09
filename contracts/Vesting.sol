pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";


contract Vesting is AragonApp {

    /// Events
    event NewLock(
        uint256 vestingId,
        address indexed claimer,
        uint256 amount,
        string  account,
        uint256 historyId
    );

    event NewProof(
        uint256 vestingId,
        address indexed claimer,
        string  proofTx
    );

    event Paused(bool state);

    /// State
    TokenManager public tokenManager;
    uint64       public vestingEnd;
    bool         public paused;

    // in general case vestingsLength > claimsLength >= proofsLength
    mapping (address => mapping (uint256 => string)) internal claims;
    mapping (address => mapping (uint256 => string)) internal proofs;

    struct ClaimEntry {
        address claimer;
        uint256 personalVestingId;
    }

    mapping (uint256 => ClaimEntry) internal history;
    uint256 public historyId;

    /// ACL
    bytes32 constant public PAUSE_ROLE = keccak256("PAUSE_ROLE");
    bytes32 constant public PROOF_ROLE = keccak256("PROOF_ROLE");

    /// ERRORS
    string private constant ERROR_LOCK_ON_PAUSE = "LOCK_ON_PAUSE";
    string private constant ERROR_WRONG_ACCOUNT = "WRONG_ACCOUNT";
    string private constant ERROR_PAST_END      = "PAST_END";
    string private constant ERROR_NO_BALANCE    = "NO_BALANCE";

    function initialize(
        address _tokenManager,
        uint64  _vestingEnd
    )
        public
        onlyInit
    {
        require(_vestingEnd > getTimestamp64(), ERROR_PAST_END);
        tokenManager = TokenManager(_tokenManager);
        vestingEnd = _vestingEnd;
        paused = false;

        initialized();
    }

    /**
     * @notice I want to vest `_amount` GOLs and recieve `_amount` EULs to `_account`
     */
    function lock(
        uint256 _amount,
        string memory _account
    )
        public
        returns (uint256)
    {
        require(paused == false, ERROR_LOCK_ON_PAUSE);

        bytes memory accountBytes = bytes(_account);
        require(accountBytes.length == 44, ERROR_WRONG_ACCOUNT);

        require(tokenManager.spendableBalanceOf(msg.sender) >= _amount, ERROR_NO_BALANCE);

        tokenManager.burn(msg.sender, _amount);
        tokenManager.issue(_amount);

        uint256 claimId = tokenManager.assignVested(
            msg.sender,
            _amount,
            getTimestamp64(),
            vestingEnd,
            vestingEnd,
            false
        );

        claims[msg.sender][claimId] = _account;

        history[historyId] = (ClaimEntry({
            claimer: msg.sender,
            personalVestingId: claimId
        }));

        emit NewLock(
            claimId,
            msg.sender,
            _amount,
            _account,
            historyId
        );
        historyId += 1;

        return claimId;
    }

    function addProof(
        address _claimer,
        uint256 _claimId,
        string  memory _proofTx
    )
        public
        auth(PROOF_ROLE)
    {
        proofs[_claimer][_claimId] = _proofTx;

        emit NewProof(_claimId, _claimer, _proofTx);
    }

    function getClaimAddress(
        address _claimer,
        uint256 _claimId
    )
        public
        view
        returns (string)
    {
        return claims[_claimer][_claimId];
    }

    function getProof(
        address _claimer,
        uint256 _claimId
    )
        public
        view
        returns (string)
    {
        return proofs[_claimer][_claimId];
    }

    function getHistory(uint256 _claimId)
        public
        view
        returns (address, uint256)
    {
        ClaimEntry storage claimEntry = history[_claimId];

        return (claimEntry.claimer, claimEntry.personalVestingId);
    }

    function pause()
        public
        auth(PAUSE_ROLE)
    {
        paused = true;
        emit Paused(true);
    }

    function unpause()
        public
        auth(PAUSE_ROLE)
    {
        paused = false;
        emit Paused(false);
    }
}