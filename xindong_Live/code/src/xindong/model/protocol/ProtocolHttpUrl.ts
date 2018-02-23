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
    // private static ip = "http://47.104.85.224:";
    // private static port = "80";

    private static ip = "http://47.104.85.224:";
    private static port = "9000";

    public static url = ProtocolHttpUrl.ip + ProtocolHttpUrl.port;

    /**请求手机验证码 */
    public static sendCode  = "/user/tel/send/code";
    /**请求手机登录 */
    public static telLogin = "/user/tel/login";
    /**注册 */
    public static register = "/user/register";
    /**登录 */
    public static login = "/user/login";
    /**7k7k登录 */
    public static k7k7_login = "/user/login/7k7k";
    /**游客登录 */
    public static guest = "/user/guest";
    /**登出 */
    public static logout = "/user/logout";
    /**游戏信息 */
    public static gameinfo = "/game/info";
    /**微信聊天 */
    //public static chat = "/chat/finish";
    /**恋爱列表 */
    public static loves = "/user/loves";
    /**恋爱开始 */
    public static loveStart = "/love/start";
    /**恋爱结束 */
    public static loveFinish = "/love/finish";
    /**恋爱立即结束 */
    public static loveFinishNow = "/love/finish/immediate";

        /**工作列表 */
    public static works = "/user/works";
    /**工作开始 */
    public static workStart = "/work/start";
    /**工作结束 */
    public static workFinish = "/work/finish";
    /**工作立即结束 */
    public static workFinishNow = "/work/finish/immediate";
    /**升职 */
    public static workPromotion = "/work/promotion";
    /**快速升职 弃用*/
    public static workQuickUp = "/work/promotion/fast";

    /**请求电话微信 */
    public static userChats =  "/user/chats";

    /**道具购买 */
    public static toolsBuy = "/shop/tool/buy";
    /**礼包购买 */
    public static giftBuy = "/shop/gift/buy";
    /**背包列表 */
    public static bags =  "/user/bags";

    /**能否升级判断接口 */
    public static prepare = "/game/prepare";
    /**用户升级 */
    public static upgrade = "/game/level/upgrade";
    /**购买视频 */
    public static videoBuy = "/user/video/buy";
    /**视频播放接口 */
    public static videoPlay = "/video/play";
    /**微博评论 */
    public static weiboComment = "/weibo/comment";
    /**微博赞 */
    public static weiboApprove = "/weibo/approve";
    
    /**使用道具 */
    public static useTool = "/shop/tool/use";
    /**礼品下方 */
    public static giftForUser = "/shop/ios/gift/to/user";
    /**领取体力 */
    public static powerGain = "/power/gain";
    /**邮件列表 */
    public static mailList = "/mail/list";
    /**领取邮件 */
    public static mailLingqu = "/mail/gain";
    /**新手引导接口 */
    public static guide = "/guide/will_do_guide";
    /**新手引导接口完成 */
    public static guideDone = "/guide/step_done";
    /**随机用户名 */
    public static randomName = "/user/name/random";
    /**用户昵称绑定 */
    public static nameBind = "/user/name/bind";
    /**协议图片 */
    public static protocalImg = "/user/princeple";
    /**体力状态 */
    public static tiliStatus = "/user/power/status";
    /**获取视频url  浏览器使用*/
    public static videoUrl ="/video/url";

    public static payStatusH5 = "/user/pay/status";
    /**请求分享奖励 */
    public static shareGain = "/share/gain";
    /**登录奖励详情 */
    public static loginReward = "/user/login/reward";
    /**领取登录奖励 */
    public static gainLoginReward ="/user/login/reward/gain";
    /**首付礼包详情 */
    public static fpayReward = "/user/fpay/reward";
    /**访问邀请码 */
    public static inviteGain = "/user/invite/gain";
    /**请求首冲礼包奖励 */
    public static rewardGin = "/user/fpay/reward/gain";
    /**公告 */
    public static attention = "/game/attention";

    //=================== 排行榜 ======================
    /**排行榜 */
    public static rank = "/act/rank";

    /**收藏 */
    public static collection = "/collection/list";
    /**购买音乐 */
    public static buyBgm = "/bgm/buy";
    /**设置音乐 */
    public static setBgm = "/bgm/set";
    /**购买背景图 */
    public static buyBgi = "/bgi/buy";
    /**设置背景图 */
    public static setBgi = "/bgi/set";
    /**设置赠礼背景图 */
    public static setGiftBgi = "/gift/bgi/set"
    //=================== 活动中心 ======================
    /**活动中心详情 */
    public static actList = "/act/list";
    /**领取登录奖励 */
    public static loginRewardGain ="/user/login/reward/gain";
    //==================== 设置 =====================
    /**绑定手机 */
    public static telBind = "/user/tel/bind";

    //=====================  chenkai ============
    /**电话完成 */
    public static telFinish = "/tel/finish";
    /**微信完成 */
    public static wechatFinish = "/wechat/finish";
    /**抽取奖品 */
    public static lotteryRandom = "/act/lottery/random";
    /**抽取奖品 */
    public static lotteryTen = "/act/lottery/random/ten";
    /**电话结算 */
    public static telScore = "/tel/score/sum";
    /**微信结算 */
    public static wechatScore = "/wechat/score/sum";
    /**用户反馈 */
    public static feedback = "/setting/report";

    //=====================  huanglong ============
    /**互动主页，答题消耗信息 */
    public static questionAnsMain = "/question/cons";
	/**问题列表 */
    public static questionList = "/question/list";
    /**回答问题 */
    public static questionAnswer = "/question/answer";
    /**去掉错误答案 */
    public static questionCut = "/question/cut";
    /**问题结算 */
    public static questionResult = "/question/sum"
    /**礼物列表 */
    public static giftList = "/gift/send/info";
    /**赠送礼物 */
    public static sendGift = "/gift/send/do";
    /**恋爱列表 */
    public static loveList = "/user/loves";
    /**原生登录短信验证 */
    public static loginVerify = "/user/tel/verify";
    /**原生登录 */
    public static loginNative = "/user/login/u8";
    /**背景音乐列表 */
    public static bgmList = "/setting/info";
}
