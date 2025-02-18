// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {EIP712Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import {ERC721PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {ERC721VotesUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721VotesUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IFreelancerNFT} from "../interfaces/IFreelancerNFT.sol";

/// @custom:security-contact devs@mintedin.org
contract FreelancerNFT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721PausableUpgradeable,
    AccessControlUpgradeable,
    EIP712Upgradeable,
    ERC721VotesUpgradeable,
    UUPSUpgradeable,
    IFreelancerNFT
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @custom:storage-location MintedIn:FreelancerNFT.storage.FreelancerStorage
    struct FreelancerStorage {
        uint256 _nextTokenId;
        mapping(address => uint256) tokenIds;
        mapping(uint256 => Freelancer) freelancers;
    }

    // keccak256(abi.encode(uint256(keccak256("FreelancerNFT.storage.FreelancerStorage")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant FreelancerStorageLocation =
        0x77e329dbd18313a6498d1f7e745f7c5db79ca6e9ca086a1fed9bec16ef173d00;

    function _getFreelancerStorage()
        private
        pure
        returns (FreelancerStorage storage freelancers)
    {
        assembly {
            freelancers.slot := FreelancerStorageLocation
        }
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address defaultAdmin,
        address pauser,
        address minter,
        address upgrader
    ) public initializer {
        __ERC721_init("FreelanceNFT", "MIF");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Pausable_init();
        __AccessControl_init();
        __EIP712_init("FreelanceNFT", "1");
        __ERC721Votes_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(UPGRADER_ROLE, upgrader);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(
        address to,
        string memory uri
    ) public onlyRole(MINTER_ROLE) {
        FreelancerStorage storage $ = _getFreelancerStorage();

        uint256 tokenId = $._nextTokenId++;
        $.tokenIds[to] = tokenId;
        // $.freelancers[tokenId] = new Freelancer(0, 0, 0, new Job[](0));

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721PausableUpgradeable,
            ERC721VotesUpgradeable
        )
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    )
        internal
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721VotesUpgradeable
        )
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721URIStorageUpgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// Dynamic attributes for FreelancerNFT
    function tokenIdOf(address owner) external view override returns (uint256) {
        FreelancerStorage storage $ = _getFreelancerStorage();
        return $.tokenIds[owner];
    }

    function getFreelancerData(
        uint256 tokenId
    ) public view returns (Freelancer memory) {
        return _getFreelancerStorage().freelancers[tokenId];
    }

    function setFreelancerData(
        uint256 tokenId,
        Freelancer memory data
    ) public onlyRole(MINTER_ROLE) {
        _getFreelancerStorage().freelancers[tokenId] = data;
    }
}
