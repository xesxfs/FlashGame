/**
 * Http协议
 * @author chenkai
 * @date 2016/11/17
 */
class ProtocolHttp {
    /**http 头*/
    public static httpHead = {
        Authorization: ""
    }

    /**注册 */
    public static register = {
        username: "",
        passwd: "",
        guest: "",
        channel_id:0
    }

    /**登录 */
    public static login = {
        username: "",
        passwd: "",
        channel_id:0
    }

    /**游客登录 */
    public static guest = {
        username: "",
        channel_id:0
    }

    /**登出 */
    public static logout = {
        username: ""
    }

    /**微信聊天 */
    public static chat = {
        id: 0,
        pid: 0,
        sid: 0,
        instant :0,
    }

    /**恋爱开始 */
    public static loveStart = {
        lid:0
    }

    /**恋爱结束 */
    public static loveFinish ={
        lid:0
    }

    /**工作开始 */
    public static workStart = {
        wid:0
    }

    /**工作结束 */
    public static workFinish = {
        wid:0
    }

    /**道具购买 */
    public static toolsBuy = {
        gid :0,
        count :0
    }
    /**礼包购买 */
    public static giftBuy = {
        gid:0
    }
}