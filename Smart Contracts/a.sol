// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.4;

contract NewsPublisher {
    struct post {
        string id;
        bool exists;
        address author;
        string authorId;
        string authorName;
        string authorDescription;
        string title;
        string content;
        string bannerUrl;
        uint256 timestamp;
    }

    struct author {
        string id;
        bool exists;
        uint256 myIndex;
        address authorAddress;
        string authorName;
        string authorDescription;
        string[] postIds;
        string[] followingIds;
    }

    mapping(string => post) public posts;
    mapping(address => author) public authors; // Authors mapped to there addresses
    mapping(string => author) public authorsIdSort; // Authors mapped to there uids
    mapping(uint256 => post) public postIndexSort; // post with a index
    mapping(uint256 => author) public authorIndexSort; // authors with a index

    uint256 public postIndexCurrent = 0;
    uint256 public authorIndexCurrent = 0;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function createAuthor(
        string memory authorId,
        string memory authorName,
        string memory authorDescription
    ) public payable {
        require(!authors[msg.sender].exists);
        require(!authorsIdSort[authorId].exists);
        string[] memory emptyArr;

        author memory newAuthor = author(
            authorId,
            true,
            authorIndexCurrent,
            msg.sender,
            authorName,
            authorDescription,
            emptyArr,
            emptyArr
        );

        authors[msg.sender] = newAuthor;
        authorsIdSort[authorId] = newAuthor;
        authorIndexSort[authorIndexCurrent] = newAuthor;
        authorIndexCurrent = authorIndexCurrent + 1;
    }

    function createPost(
        string memory postId,
        string memory title,
        string memory content,
        string memory bannerUrl
    ) public payable {
        require(!posts[postId].exists);

        uint256 cuurentReqAuthorInex = authors[msg.sender].myIndex;
        string memory currentAuthorID = authors[msg.sender].id;

        post memory newPost = post(
            postId,
            true,
            msg.sender,
            authors[msg.sender].id,
            authors[msg.sender].authorName,
            authors[msg.sender].authorDescription,
            title,
            content,
            bannerUrl,
            block.timestamp
        );

        posts[postId] = newPost;
        postIndexSort[postIndexCurrent] = newPost;
        postIndexCurrent = postIndexCurrent + 1;

        authors[msg.sender].postIds.push(postId);
        authorsIdSort[currentAuthorID].postIds.push(postId);
        authorIndexSort[cuurentReqAuthorInex].postIds.push(postId);
    }

    function follow(string memory followingIds) public {
        authors[msg.sender].followingIds.push(followingIds);
        authorsIdSort[authors[msg.sender].id].followingIds.push(followingIds);
        authorIndexSort[authors[msg.sender].myIndex].followingIds.push(
            followingIds
        );
    }

    function getFollowingById(
        address authorAddr
    ) public view returns (string[] memory) {
        return (authors[authorAddr].followingIds);
    }

    function getPostsByAuthorAddress(
        address authorAddress
    ) public view returns (string[] memory) {
        return (authors[authorAddress].postIds);
    }

    function getPostsByAuthorID(
        string memory id
    ) public view returns (string[] memory) {
        return (authorsIdSort[id].postIds);
    }

    function getPostsByAuthorIndex(
        uint256 indexAuthorCurr
    ) public view returns (string[] memory) {
        return (authorIndexSort[indexAuthorCurr].postIds);
    }

    function withdrawETH() public {
        require(msg.sender == owner, "not owner");
        address payable to = payable(owner);
        to.transfer(address(this).balance);
    }

    function withdrawAToken(address tokenAddress) public {
        require(msg.sender == owner, "not owner");
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        IERC20(tokenAddress).transfer(owner, balance);
    }
}

// }Introduce the concept of following in authors
// add description in post struct
// add author name in post struct
