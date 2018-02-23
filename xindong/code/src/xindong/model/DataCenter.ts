/**
 * 数据中心
 * @author chenkai 
 * @date 2016/6/27
 */
class DataCenter extends SingleClass{
     /**用户信息 */
    public UserInfo:UserInfo;
    /**配置 */
    public ConfigInfo:ConfigInfo;
    /**用户协议内容   */
    public userAgreeInfo:UserAgreeInfo; 
    /**登录奖励详情 */
    public loginRewardInfo;
    /**渠道信息 */
    public channelInfo:ChannelInfo;

    /**电话消息 */
    public Tel;
    /**微信消息 */
    public Wechat;
    /**恋爱 */
    public Love;
    /**工作 */
    public Work;
    /**商城 */
    public Shop;
    /**背包 */
    public Bags;
    /**视频 */
    public Video;
    /**微博 */
    public Weibo;
    /**是否能领取体力 */
    public isPower = false;
    /**邮件 */
    public mail = [];
    /**引导 */
    public guide;
    /**礼包数据 */
    public keybuy;
    /**首冲双倍活动事件 */
    public act_decade;
    
    /**http请求权鉴 */
    public skey = ""; 

    /**引导 */
    public dianhuaGuide = false;
    public weixinGuide = false;
    public shipinGuide = false;
    public loveGuide = false;
    public workGuide = false;

    /**登录奖励(是否有登录奖励可以领取标志位)  活动中心内按钮状态：0不显示红点 1显示红点 -1不显示 */
    public login_reward:number = 0;      
    /**首冲礼包(是否第一次充值) false没冲过值  true冲过值 */
    public first_gift:boolean = false;  
    /**是否当天第一次登录 */
    public is_first_login:boolean = false; 
    /**视频是否正在播放(用于播放时停止bgm) */
    public isVideoPlaying:boolean = false;

    public constructor(){
        super();
        this.UserInfo = new UserInfo();
        this.ConfigInfo = new ConfigInfo();
        this.userAgreeInfo = new UserAgreeInfo();
        this.channelInfo = new ChannelInfo();
    }

    /**读取游戏信息 */
    public readGameInfo(data){
        let json = ProtocolHttpData.gameInfo;
        json = data;
        App.DataCenter.Wechat = json.data.wechat;
        App.DataCenter.Tel = json.data.tel;
        App.DataCenter.Love = json.data.love;
        App.DataCenter.Work = json.data.work;
        App.DataCenter.Shop = json.data.shop;
        App.DataCenter.Bags = json.data.back;
        App.DataCenter.Video = json.data.video;
        App.DataCenter.Weibo = json.data.weibo;
        App.DataCenter.isPower = data.data.power.can_get_power;
        App.DataCenter.keybuy = data.data.keybuy;
        App.DataCenter.guide = data.data.guide;
        App.DataCenter.mail = data.data.mail;
        App.DataCenter.login_reward = data.data.login_reward;     
        App.DataCenter.first_gift = data.data.first_gift;         
        App.DataCenter.is_first_login = data.data.is_first_login; 
        App.DataCenter.act_decade = data.data.act_decade;

        //用户资料
        App.DataCenter.UserInfo.nickName = json.data.userinfo.nick_name;
        App.LocalStorageUtil.username = json.data.userinfo.user_name;
        App.DataCenter.UserInfo.uid = json.data.userinfo.uid;
        App.DataCenter.UserInfo.days = json.data.userinfo.days;
        App.DataCenter.UserInfo.diamond = json.data.userinfo.diamond;
        App.DataCenter.UserInfo.gold = json.data.userinfo.gold;
        App.DataCenter.UserInfo.hearts = json.data.userinfo.hearts;
        App.DataCenter.UserInfo.power = json.data.userinfo.power;
        App.DataCenter.UserInfo.wc_wait = json.data.userinfo.wc_wait;
        if (json.data.work && json.data.work[0]) {
            App.DataCenter.UserInfo.workCount = json.data.work[0].left_times;
        };
        //配置
        App.DataCenter.ConfigInfo.main_event = json.data.config.main_event;
        App.DataCenter.ConfigInfo.avilable_event = json.data.config.avilable_event;
        App.DataCenter.ConfigInfo.days = json.data.config.days;
        App.DataCenter.ConfigInfo.hearts = json.data.config.hearts;
        App.DataCenter.ConfigInfo.video = json.data.config.video;
        App.DataCenter.ConfigInfo.girl_name = json.data.config.girl_name;

        //下阶段可做的事
        if (data.data.tel.nexttel && data.data.tel.nexttel.length > 0) {
            App.DataCenter.UserInfo.nextTel = true;
            App.DataCenter.UserInfo.tel_main = false;
        } else {
            App.DataCenter.UserInfo.nextTel = false;
            App.DataCenter.UserInfo.tel_main = true;//主事件完成
        }
        if (data.data.wechat.nextwechat && data.data.wechat.nextwechat.length > 0) {
            App.DataCenter.UserInfo.nextWechat = true;
            App.DataCenter.UserInfo.wechat_main = false;
        } else {
            App.DataCenter.UserInfo.nextWechat = false;
            App.DataCenter.UserInfo.wechat_main = true//主事件完成
        }
    }

    /**提前预加载图片 */
    public preLoadImg(data, doc:egret.DisplayObjectContainer){
        //有人说这样搞，可以提高加载图片速度
        let img = new eui.Image(data.data.wechat.head);
        img.x = -100;
        img.y = -100;
        img.alpha = 0;
        doc.addChild(img);

        let img1 = new eui.Image(data.data.tel.head);
        img1.x = -100;
        img1.y = -100;
        img1.alpha = 0;
        doc.addChild(img1);

        data.data.love.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.work.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.shop.giftpcak.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.shop.tools.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.shop.diamonds.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.shop.golds.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.shop.limitpack.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.back.map(item => {
            let img = new eui.Image(item.pic);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.video.fav.map(item => {
            let img = new eui.Image(item.preview);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
        data.data.video.mem.map(item => {
            let img = new eui.Image(item.preview);
            img.x = -100;
            img.y = -100;
            img.alpha = 0;
            doc.addChild(img);
        });
    }
}


/**登录奖励领取状态 */
enum RevRewardStatus{
    CanRev = 0,     //可领取
    AlreadyRev = 1, //已领取
    CannotRev = 2   //未达到天数不可领取
}

/**登录奖励状态 */
enum LoginRewardStatus{
    NoRedTip = 0,  //活动中心内 登录奖励不显示红点
    RedTip = 1,    //活动中心内 登录奖励显示红点
    HideBtn = -1   //活动中心内 不显示登录奖励按钮
}

/**视频类型 */
class VideoType{
    /**回忆 */
    public static mem:string = "1";
    /**珍藏 */
    public static fav:string = "2";
}

/**游客类型 */
class GuestType{
    /**游客 */
    public static YES = "1";
    /**非游客 */
    public static NO = "0";
}

/**首冲领取状态 */
enum SCGainStatus{
    NoBuy = -1,  //未购买, 未领取
    HasBuy = 0,  //已购买, 未领取
    HasGain = 1  //已购买已领取
}