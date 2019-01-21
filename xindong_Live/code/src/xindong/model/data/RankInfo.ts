/**
 * 排行榜信息
 * @author chenkai 2017/12/20
 */
class RankInfo {

	public hearts:Array<RankVO>;     //心动榜
	public question:Array<RankVO>;   //情商榜
	public gift:Array<RankVO>;       //礼物榜
	public gold:Array<RankVO>;       //富豪榜

	public myHeartRank:number;       //我的排名
	public myQuestionRank:number;
	public myGiftRank:number;
	public myGoldRank:number;

	//----扩展-----
	public rankMax:number = 50;       //排名最大值

	public readData(data){
		this.hearts = data.hearts.top;
		this.question = data.question.top;
		this.gift = data.gift.top;
		this.gold = data.gold.top;

		this.myHeartRank = data.hearts.self_rank;
		this.myQuestionRank = data.question.self_rank;	
		this.myGiftRank = data.gift.self_rank;	
		this.myGoldRank = data.gold.self_rank;
	}
}

class RankVO{
	public rank:number;       //排名
	public nick_name:string;  //昵称
	public score:number;      //分值
	public types:string;      //排行类型 RankType
}

/**排行榜类型 */
class RankType{
	public static Heart:string = "hears";        //心动榜
	public static Gold:string = "gold";          //富豪榜
	public static Gift:string = "gift";          //礼物榜
	public static Question:string = "question";  //情商榜
}
 