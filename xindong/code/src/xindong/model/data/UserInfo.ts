/**
 * 用户数据
 * @author xiongjian 
 * @date 2017/9/8
 */
class UserInfo {
    /**角色名(id) */
    public uid:string = "";
    /**昵称*/
    public nickName: string = "";
    /**用户天数*/
    public days:number = 0;    
    /**砖石*/
    public diamond:number = 0; 
    /**金币*/
    public gold:number = 0;   
    /**恋爱值*/
    public hearts:number = 0;  
    /**体力值*/
    public power:number = 0;   
    /**微信等待时间*/
    public wc_wait:number = 0; 

    /**工作经验 */
    public exps:number = 0;
    /**是否有下一段电话 */
    public nextTel:boolean = false;
    /**是否有下一段微信 */
    public nextWechat:boolean = false;
    /**微博是否可评论可赞 */
    public nextWeibo:boolean = false;

    /**剩余工作次数 */
    public workCount:number = 0;
    /**电话主事件是否完成 */
    public tel_main:boolean = false;
    /**微信主事件是否完成 */
    public wechat_main:boolean = false;

    /**礼包弹出随机常数 */
    public randNum = 3;
}