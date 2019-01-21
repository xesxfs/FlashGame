/**
 * 活动中心
 * @author chenkai 2017/12/20
 */
class ActInfo {
	public login = {            //登录奖励
		status:0,               //0显示红点
		data:{},
		edate:"",
		sdate:""
	};

	public login_on:boolean;    //登录奖励是否开放
	public code_on:boolean;     //兑换码是否开放
	public fdouble_on:boolean;  //首充双倍是否开放
	public fpay_on:boolean;     //首充礼包是否开放
	public lottery_on:boolean;  //幸运抽奖是否开放

	//首充礼包
	public fpay = {
		status:0,               //SCGainStatus
		package:{},             //首充礼物
		price:0,                //奖励价值
		id:0                    //id
	}         
	
	/**抽奖的14个奖品详情*/
	public lottery = {          //抽奖
		status:0,               //0显示红点
		cons:0,                 //抽奖消耗
		cons_type:"",           //抽奖类型
		data:[]                 //奖品详情 LotteryItemVO
	}
	
	public fpay_double = {     //首充双倍活动时间
		edate:"",
		sdate:""
	}
	
	public readData(data){
		this.login = data.login;
		this.login_on = data.login_on;
		this.code_on = data.code_on;
		this.fdouble_on = data.fdouble_on;
		this.fpay_on = data.fpay_on;
		this.lottery_on = data.lottery_on;
		this.fpay = data.fpay;
		this.lottery = data.lottery;
		this.fpay_double = data.fpay_double;
	}	
}

/**每日登录奖励 */
class loginVO{
	public days:number;     //天数
	public gift:any;        //奖励礼物
	public status:number;   //领取状态 GainRewardStatus
}

/**奖品单个项详情 */
class LotteryItemVO{
	public gid:number;      //?
	public id:number;       //奖品id
	public level:number;    //?
	public name:string;     //奖品名称
	public pic:string;      //奖品图片
	public quantity:number; //?
	public rate:number;     //?
}

/**抽奖结果 */
class LotteryResultVO{
	public name:string;      //奖品名
	public level:number;     //?
	public pic:string;       //奖品图片
	public gid:number;       //?
	public id:number;        //奖品id
	public quantity:number;  //?
}

/**首冲领取状态 */
enum SCGainStatus{
    NoBuy = -1,  //未购买, 未领取
    HasBuy = 0,  //已购买, 未领取
    HasGain = 1  //已购买已领取
}