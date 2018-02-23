/**
 * Http协议
 * @author xiongjian
 * @date 2016/11/17
 */
class ProtocolHttpUrl {

    //正式
    // private static ip = "http://www.dmgame.com:";
    // private static port = "80";

    //测试
    private static ip = "http://192.168.1.249:";
    //private static ip = "http://47.104.85.224:";
    private static port = "8081";

    public static url = ProtocolHttpUrl.ip + ProtocolHttpUrl.port;


    /**注册 */
    public static register = "/user/register/";
    /**登录 */
    public static login = "/user/login/";
    /**7k7k登录 */
    public static k7k7_login = "/user/login/7k7k/";
    /**游客登录 */
    public static guest = "/user/guest/";
    /**登出 */
    public static logout = "/user/logout/";
    /**游戏信息 */
    public static gameinfo = "/game/info/";
    /**微信聊天 */
    public static chat = "/chat/finish/";
    /**恋爱列表 */
    public static loves = "/user/loves/";
    /**恋爱开始 */
    public static loveStart = "/love/start/";
    /**恋爱结束 */
    public static loveFinish = "/love/finish/";
    /**恋爱立即结束 */
    public static loveFinishNow = "/love/finish/immediate/";

    /**工作列表 */
    public static works = "/user/works/";
    /**工作开始 */
    public static workStart = "/work/start/";
    /**工作结束 */
    public static workFinish = "/work/finish/";
    /**工作立即结束 */
    public static workFinishNow = "/work/finish/immediate/";
    /**升职 */
    public static workPromotion = "/work/promotion/";

    /**请求电话微信 */
    public static userChats = "/user/chats/";

    /**道具购买 */
    public static toolsBuy = "/shop/tool/buy/";
    /**礼包购买 */
    public static giftBuy = "/shop/gift/buy/";
    /**背包列表 */
    public static bags = "/user/bags/";

    /**能否升级判断接口 */
    public static prepare = "/game/prepare/";
    /**用户升级 */
    public static upgrade = "/game/level/upgrade/";
    /**购买视频 */
    public static videoBuy = "/user/video/buy/";
    /**视频播放接口 */
    public static videoPlay = "/video/play/";
    /**微博评论 */
    public static weiboComment = "/weibo/comment/";
    /**微博赞 */
    public static weiboApprove = "/weibo/approve/";

    /**使用道具 */
    public static useTool = "/shop/tool/use/";
    /**礼品下方 */
    public static giftForUser = "/shop/ios/gift/to/user/";
    /**领取体力 */
    public static powerGain = "/power/gain/";
    /**邮件列表 */
    public static mailList = "/mail/list/";
    /**领取邮件 */
    public static mailLingqu = "/mail/gain/";
    /**新手引导接口 */
    public static guide = "/guide/will_do_guide/";
    /**新手引导接口完成 */
    public static guideDone = "/guide/step_done/";
    /**随机用户名 */
    public static randomName = "/user/name/random/";
    /**用户昵称绑定 */
    public static nameBind = "/user/name/bind/";
    /**协议图片 */
    public static protocalImg = "/user/princeple/";
    /**体力状态 */
    public static tiliStatus = "/user/power/status/";
    /**获取视频url  浏览器使用*/
    public static videoUrl = "/video/url/";

    public static payStatusH5 = "/user/pay/status/";
    /**请求分享奖励 */
    public static shareGain = "/share/gain/";
    /**登录奖励详情 */
    public static loginReward = "/user/login/reward/";
    /**领取登录奖励 */
    public static gainLoginReward = "/user/login/reward/gain/";
    /**首付礼包详情 */
    public static fpayReward = "/user/fpay/reward/";
    /**访问邀请码 */
    public static inviteGain = "/user/invite/gain/";
    /**请求首冲礼包奖励 */
    public static rewardGin = "/user/fpay/reward/gain/";
    /**视频列表 */
    public static videoList = "/user/videos/";
    /**公告 */
    public static attention = "/game/attention/";
}
