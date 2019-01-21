/**
 * 电话信息 暂时没用到
 * @author chenkai 2018/1/2
 */
class TelInfo {
	public head:string;                    //头像
	public history:Array<TelHistoryVO>;    //历史通话记录
	public nexttel:Array<TelNextVo>;       //下一步通话记录

	public readData(data){
		this.head = data.head;
		this.history = data.history;
		this.nexttel = data.nexttel;
	}

	/**获取最后一条历史通话记录的拷贝 (不能直接将hist当做List的数据源)*/
	public getLastHistoryCopy():Array<TelHistVO>{
		//没有历史数据时，服务端传过来null。 客户端新建一个，不然无法存储第一次通话的历史记录
        if(this.history[0] == null){
			this.history = [new TelHistoryVO()];
        }

		let hist:Array<TelHistVO> = this.history[0].hist;
        let copy:Array<TelHistVO> = [];
        for(let i=0;i<hist.length;i++){
            copy[i] = hist[i];
        }
		
		return copy;
	}

	/**添加数据到最后一条历史记录 */
	public addLastHistory(telHistVO:TelHistVO){
		if(this.history && this.history.length > 0){
			this.history[0].hist.push(telHistVO);
		}
	}

	/**是否是第一次对话 */
	public isFirstTel(){
		if(this.history.length == 1 && this.history[0].hist.length <= 1){
			return true;
		}
		return false;
	}

	/**是否第一次微信 （第一次微信时，电话的历史记录1条）*/
	public isFirstWx(){
		if(this.history.length == 1){
			return true;
		}
		return false;
	}

}

/**电话历史记录 */
class TelHistoryVO{
	public days:number;
	public hist:Array<TelHistVO> = [];
}

/**历史通话记录和下一步通话记录，数据格式一致 */
class TelHistVO{
	public audio:string;      //语音
	public cons:number;       //消耗
	public content:string;    //聊天内容
	public days:number;       //天数
	public id:number;         //id
	public next_id:number;
	public pid:number;
	public role:number;       //角色     RoleType
	public score:number;      //获得分数
	public sid:number;
	public tid:number;
	public tips:string;       //回答等级  TelTips
}

/**电话下一步数据 */
class TelNextVo{
	public audio:string;
	public cons:number;
	public content:string;
	public days:number;
	public id:number;
	public next_id:number;
	public pid:number;
	public role:number;
	public score:number;
	public sid:number;
	public tid:number;
	public tips:string;  //TelTips
}

