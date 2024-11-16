// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract DAOGenie {
    struct DAO {
        uint256 id;
        uint256 createdAt;
        string name;
        address creator;
        uint256 totalVotes;
        uint256 numberOfMembers;
        uint256 numberOfProposals;
    }

    struct Proposal {
        address creator;
        uint256 createdAt;
        uint256 votingEndsAt;
        string title;
        string description;
        bool passed;
        uint256 votesNeededToPass;
        uint256 yesVotes;
    }

    // Events
    event ProposalCreated(uint256 daoId, uint256 proposalIndex, address creator, string title);
    event ProposalVotedOn(uint256 daoId, uint256 proposalIndex, address voter, uint256 votes);
    event ProposalPassed(uint256 daoId, uint256 proposalIndex);

    // State variables
    uint256 private nextDaoId = 1;
    mapping(uint256 => DAO) public daos;
    mapping(uint256 => address[]) public daoMembers;
    mapping(uint256 => mapping(address => uint256)) public daoVotes;
    mapping(uint256 => Proposal[]) public daoProposals;

    // Constants
    uint256 private constant INITIAL_VOTES = 1_000_000;
    uint256 private constant VOTING_DURATION = 7 days;

    function createDAO(string memory name) external returns (uint256) {
        uint256 daoId = nextDaoId++;

        daos[daoId] = DAO({
            id: daoId,
            createdAt: block.timestamp,
            name: name,
            creator: msg.sender,
            totalVotes: INITIAL_VOTES,
            numberOfMembers: 1,
            numberOfProposals: 0
        });

        daoMembers[daoId].push(msg.sender);
        daoVotes[daoId][msg.sender] = INITIAL_VOTES;

        return daoId;
    }

    function reallocateVotes(uint256 daoId, address to, uint256 amount) external {
        require(daoVotes[daoId][msg.sender] >= amount, "Insufficient votes");

        daoVotes[daoId][msg.sender] -= amount;

        if (daoVotes[daoId][to] == 0) {
            daoMembers[daoId].push(to);
            daos[daoId].numberOfMembers++;
        }

        daoVotes[daoId][to] += amount;
    }

    function createProposal(
        uint256 daoId,
        string memory title,
        string memory description
    ) external {
        require(daoVotes[daoId][msg.sender] > 0, "Not a DAO member");

        uint256 votesNeeded = daos[daoId].totalVotes / 2 + 1;

        Proposal memory newProposal = Proposal({
            creator: msg.sender,
            createdAt: block.timestamp,
            votingEndsAt: block.timestamp + VOTING_DURATION,
            title: title,
            description: description,
            passed: false,
            votesNeededToPass: votesNeeded,
            yesVotes: 0
        });

        daoProposals[daoId].push(newProposal);
        uint256 proposalIndex = daoProposals[daoId].length - 1;
        daos[daoId].numberOfProposals++;

        emit ProposalCreated(daoId, proposalIndex, msg.sender, title);
    }

    function voteOnProposal(uint256 daoId, uint256 proposalIndex) external {
        require(daoVotes[daoId][msg.sender] > 0, "Not a DAO member");

        Proposal storage proposal = daoProposals[daoId][proposalIndex];

        require(!proposal.passed, "Proposal already passed");
        require(block.timestamp < proposal.votingEndsAt, "Voting period ended");

        uint256 memberVotes = daoVotes[daoId][msg.sender];
        proposal.yesVotes += memberVotes;

        emit ProposalVotedOn(daoId, proposalIndex, msg.sender, memberVotes);

        if (proposal.yesVotes >= proposal.votesNeededToPass && !proposal.passed) {
            proposal.passed = true;
            emit ProposalPassed(daoId, proposalIndex);
        }
    }

    // View functions
    function getDAO(uint256 daoId) external view returns (DAO memory) {
        return daos[daoId];
    }

    function getDaoMembers(uint256 daoId) external view returns (address[] memory) {
        return daoMembers[daoId];
    }

    function getProposals(uint256 daoId) external view returns (Proposal[] memory) {
        return daoProposals[daoId];
    }

    function isProposalFailed(uint256 daoId, uint256 proposalIndex) external view returns (bool) {
        Proposal memory proposal = daoProposals[daoId][proposalIndex];
        return block.timestamp >= proposal.votingEndsAt && !proposal.passed;
    }
}
