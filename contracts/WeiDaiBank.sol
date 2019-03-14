pragma solidity ^0.5.0;
import "../node_modules/openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./WeiDai.sol";



contract WeiDaiBank is Secondary {

	address weiDaiAddress;
	address daiAddress;
	address donationAddress;
	address preAddress;
	address self;

	using SafeMath for uint;

	function setDependencies(address weiDai, address dai, address donation, address pre) public onlyPrimary{
		daiAddress = dai;
		weiDaiAddress = weiDai;
		donationAddress = donation;
		preAddress = pre;
		self = address(this);
	} 

	function getDaiPerWeiDai() public view returns (uint) {
		return ERC20(daiAddress).totalSupply().div(WeiDai(weiDaiAddress).totalSupply());

	}

	function issue(address sender, uint weidai,uint dai) public { //sender is dai holder, msg.sender is calling contract
		require(msg.sender == preAddress, "only patience regulation engine can invoke this function");
		ERC20(daiAddress).transferFrom(sender, self,dai); 
		WeiDai(weiDaiAddress).issue(msg.sender, weidai);
	}

	function redeemWeiDai(uint weiDai) public {
		WeiDai(weiDaiAddress).burn(msg.sender, weiDai);
		uint weiDaiToRedeem = weiDai*100/98;
		uint daiPayable = getDaiPerWeiDai().mul(weiDaiToRedeem);
		ERC20(daiAddress).transfer(msg.sender, daiPayable);
	}

	function donate(uint amount) public {
		ERC20(weiDaiAddress).transferFrom(msg.sender,self,amount);
	}

	function withdrawDonations() public onlyPrimary {
		uint balance = ERC20(weiDaiAddress).balanceOf(self);
		ERC20(weiDaiAddress).transfer(donationAddress,balance);
	} 
}
