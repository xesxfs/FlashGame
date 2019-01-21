/**
 * 渠道信息
 * @author chenkai
 * @date 2017/12/6
 */
class ChannelInfo {
	
	/**获取渠道号 */
	public getChannel(){
		let json = RES.getRes("channel_json");
		return json.channel_id;
	}	

}