/**
 * 数据中心(单例)
 * @author chenkai 
 * @date 2016/6/27
 */
class DataCenter{
    /**用户信息 */
    public UserInfo:UserInfo;
    /**配置 */
    public ConfigInfo:ConfigInfo;
    /**用户协议内容   */
    public userAgreeInfo:UserAgreeInfo; 
    /**登录奖励详情 */
    public loginRewardInfo;
    /**排行 */
    public rankInfo:RankInfo = new RankInfo();
    /**收藏 */
    public collectionInfo:CollectionInfo = new CollectionInfo();
    /**活动中心 */
    public actInfo:ActInfo = new ActInfo();
    /**互动答题 */
    public interactAnsInfo:InteractAnsInfo = new InteractAnsInfo();
    /**互动送礼 */
    public interactGiftInfo:InteractGiftInfo = new InteractGiftInfo();

    /**微信消息 */
    public Wechat;
    /**恋爱 */
    public Love: LoveInfo = new LoveInfo();
    /**工作 */
    public Work: WorkInfo = new WorkInfo();
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
    //public first_gift:boolean = false;  
    /**是否当天第一次登录 */
    public is_first_login:boolean = false; 

    //=====================  chenkai ============
    public telInfo:TelInfo = new TelInfo();    //电话信息
    

    //=====================  huanglong ============

    public constructor(){
        this.UserInfo = new UserInfo();
        this.ConfigInfo = new ConfigInfo();
        this.userAgreeInfo = new UserAgreeInfo();

        //=====================  chenkai ============

    

        //=====================  huanglong ============
        // 跳过视频在地址栏可配置
        egret.getOption("s") && (StaticCfg.skipVideo = false)
    }

    /**更新金币、钻石、心动值等数据,并刷新当前面板 */
    public reUserBase(data) {
        if (!data) return;
        if (data.diamond || data.diamond == 0) {
            App.DataCenter.UserInfo.diamond = data.diamond;
        }
        if (data.gold || data.gold == 0) {
            App.DataCenter.UserInfo.gold = data.gold;
        }
        if (data.hearts || data.hearts == 0) {
            App.DataCenter.UserInfo.hearts = data.hearts;
        }
        if (App.PanelManager.getCurPanel() && App.PanelManager.getCurPanel().topMenu) {
            App.PanelManager.getCurPanel().topMenu.setAssetUI();
        }
    }

    /**读取游戏信息 */
    public readGameInfo(data){
        let json = ProtocolHttpData.gameInfo;
        json = data;
        App.DataCenter.Wechat = json.data.wechat;
        App.DataCenter.telInfo.readData(json.data.tel);
        App.DataCenter.Love.loveList = json.data.love;
        App.DataCenter.Work.workList = json.data.work;
        App.DataCenter.Shop = json.data.shop;
        App.DataCenter.Bags = json.data.back;
        App.DataCenter.Video = json.data.video;
        //App.DataCenter.Weibo = json.data.weibo;
        //App.DataCenter.isPower = data.data.power.can_get_power;
        App.DataCenter.keybuy = data.data.keybuy;
        App.DataCenter.guide = data.data.guide;
        App.DataCenter.mail = data.data.mail;
        App.DataCenter.login_reward = data.data.login_reward;     
        //App.DataCenter.first_gift = data.data.first_gift;         
        App.DataCenter.is_first_login = data.data.is_first_login; 
        App.DataCenter.act_decade = data.data.act_decade;
        App.DataCenter.interactAnsInfo.cost = json.data.question;
        App.DataCenter.interactGiftInfo.giftTipsList = json.data.love_tips;

        //用户资料
        App.DataCenter.UserInfo.nickName = json.data.userinfo.nick_name;
        App.LocalStorageUtil.username = json.data.userinfo.user_name;
        App.DataCenter.UserInfo.id = json.data.userinfo.id;
        App.DataCenter.UserInfo.days = json.data.userinfo.days;
        App.DataCenter.UserInfo.diamond = json.data.userinfo.diamond;
        App.DataCenter.UserInfo.gold = json.data.userinfo.gold;
        App.DataCenter.UserInfo.hearts = json.data.userinfo.hearts;
        App.DataCenter.UserInfo.power = json.data.userinfo.power;
        App.DataCenter.UserInfo.wc_wait = json.data.userinfo.wc_wait;
        App.DataCenter.UserInfo.bgi = json.data.userinfo.bgi;
        App.DataCenter.UserInfo.bgm = json.data.userinfo.bgm;
        App.DataCenter.UserInfo.giftBgi = json.data.userinfo.gift_bgi;
        App.DataCenter.UserInfo.giftScore = json.data.userinfo.gift_score;
        App.DataCenter.UserInfo.role = json.data.userinfo.role;
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

    //单例
    public static instance:DataCenter;
    public static getInstance():DataCenter{
        if(this.instance == null){
            this.instance = new DataCenter();
        }
        return this.instance;
    }

    //销毁
    public destoryMe(){
        DataCenter.instance = null;
    }
}

/**登录奖励领取状态 */
enum GainRewardStatus{
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



/**通话状态 */
enum CallStatus{
    Free,     //未接通
    Waiting   //等待回复
}

/**登录类型 */
class LoginType{
    /**游客登录 */
    public static Guest = "1";
    /**账号登录 */
    public static Account = "0";
}

/**商城页 */
enum ShopPage{
    SuperValue = 0,
    Diamond,
    Gold,
    Tool,
    Work
}

/**商城道具类型 */
enum ShopTid{
    Diamond = 3,   //购买钻石
    GiftPack = 4,  //超值礼包
    Gold = 2,      //购买金币
    Tool = 1,      //购买道具
    Work = 10      //职场礼包
}

/**商城道具购买所需的货币类型 */
class ShopCoinType{ 
    public static Rmb:string = "rmb";          //人民币
    public static Diamond:string = "diamond";  //钻石
    //public static Gold:string;               //金币购买的道具没有货币类型
}

/**通话回答等级 */
class TelTips{
	public Good:string = "good";
	public Nice:string = "nice";
	public Perfect:string = "perfect";
}

/**角色性别 */
enum RoleType{
    Women = 0,
    Man = 1
}



/**一些静态配置信息 */
class StaticCfg {
    /**启动App后首次进入loginscene */
    public static firstLoginScene:boolean = true;
    /**是否是调试模式,发布时设为false */
    public static isDebug:boolean = true;
    /**强制走原生的流程 */
    public static forceNative:boolean = false;
    /**请求支付时的channel渠道名 */
    public static channel:string = "u8";
    /**JS代码前端自用版本号 */
    public static jsVerison:string = "010514";
    /**跳过视频播放 */
    public static skipVideo:boolean = true;
    /**记录最近一次播放的视频类型 */
    public static lastVideo = VideoType.mem;
}