/**
 * 原生通信
 * @author huanglong
 * 2017-03-23
 */

class NativeBridge extends SingleClass {
    /**游戏ID */
    private gameId: string;

    private t;

    public constructor() {
        super();
        this.addNativeListener();
    }

    /**
     * 添加原生消息监听
     */
    public addNativeListener() {
        //播放结束
        egret.ExternalInterface.addCallback("viedoFinishPlay", this.videoFinish);
        egret.ExternalInterface.addCallback("payFinish", this.iosPayFinish);
        egret.ExternalInterface.addCallback("androidPaySuccess", this.androidPayFinish);
        //原生登录信息
        egret.ExternalInterface.addCallback("u8Login", this.revNativeLogin);
        //支付结果
        egret.ExternalInterface.addCallback("pay", this.revPay);
    }

    /**视频播放结束 */
    private videoFinish(data) {
        App.LoadingLock.unLockBlack();
        App.SoundManager.allowPlayBGM = true;
        App.SoundManager.playBGM(SoundManager.bgm);

        if (StaticCfg.lastVideo == VideoType.mem) {
            App.EventManager.sendEvent(EventConst.guide);
        }
        else {
            App.EventManager.sendEvent(EventConst.FAV_VEDIO_END);
        }
    }

    /**ios支付完成 */
    private iosPayFinish(data) {
        App.LoadingLock.unlock();
        App.EventManager.sendEvent(EventConst.GIFTFORUSER,data);
    }

    //安卓支付完成
    private androidPayFinish(data){
        let json = JSON.parse(data);

        let { order_id , code, res } = json;
        if(code != 200){
            Tips.info(res)
            return false;
        }

        let pos = 1;
        let http = new HttpSender();
        let sendData = {
            order_id
        };

        if(this.t){
            clearInterval(this.t);
        }

        http.post(ProtocolHttpUrl.payStatusH5, sendData, (data)=>{
            if(data.code == 200){
                App.EventManager.sendEvent(EventConst.REQ_GAME_INFO);
                Tips.info(res)
                App.LoadingLock.unlock();
            }else{
                this.t = setInterval(()=>{
                if(pos > 30){
                    clearInterval(this.t);
                }else{
                    http.post(ProtocolHttpUrl.payStatusH5, sendData, (data)=>{
                        if(data.code == 200){
                            clearInterval(this.t);
                            App.EventManager.sendEvent(EventConst.REQ_GAME_INFO);
                            App.LoadingLock.unlock();
                        }
                    }, this);
                    pos++
                }
            },2000);
            }
        }, this);

    }

    /**发送播放视频 */
    public sendPlayVideo(type, url) {
        // 记录视频类型
        StaticCfg.lastVideo = type;

        //测试时，跳过视频播放
        if(StaticCfg.skipVideo){
            Tips.info("跳过视频播放");
            if (StaticCfg.lastVideo == VideoType.mem) {
                App.EventManager.sendEvent(EventConst.guide);
            }
            else {
                App.EventManager.sendEvent(EventConst.FAV_VEDIO_END);
            }
            return;
        }

        //黑色遮罩
        App.LoadingLock.lockBlack();
        //停止背景音乐
        App.SoundManager.allowPlayBGM = false;
        App.SoundManager.stopBGM();

        //App播放视频
        if(App.DeviceUtils.IsNative && (App.DeviceUtils.IsIos || App.DeviceUtils.IsAndroid)){
                let data = { type: "", auth: {} ,aliyun:""};
                data.type = type;   //播放类型 回忆or珍藏
                data.auth = url;    //视频链接
                data.aliyun = "0";  //"1"阿里云解析播放  "0"原生播放
                egret.ExternalInterface.call("videoStartPlay", JSON.stringify(data));
        }else{
            //Web播放视频
            App.MyVideo.play(url);
        }
    }

    /**发起支付 ios、web、android */
    public sendPay(data){
        if(App.DeviceUtils.IsWeb){
            App.NativeBridge.webChanelPay(data.data.order_id, data.data.product_id, data.data.safeCode);
        }
        else if(App.DeviceUtils.IsIos && App.DeviceUtils.IsNative){
            App.NativeBridge.sendIOSPay(data.data.order_id, data.data.product_id);
        }
        else if(App.DeviceUtils.IsAndroid && App.DeviceUtils.IsNative){
            // android不走这个函数
            //App.NativeBridge.sendAndroidPay(data.data.order_id, data.data.product_id);
        }
    }


    //web渠道支付
    public webChanelPay(order_id, payid, code){
        App.LoadingLock.lock(null, null, false);
         //7k7k支付
        let auth_7k7k = window["auth_7k7k"];
        if(auth_7k7k){
            let K7_SDK = window["K7_SDK"];
             K7_SDK.Pay({
                "safeCode": code
             });

             let pos = 1;
             let http = new HttpSender();
             let sendData = {
                 order_id
             };

             if(this.t){
                 clearInterval(this.t);
             }

             this.t = setInterval(()=>{
                 if(pos > 30){
                     clearInterval(this.t);
                 }else{
                      http.post(ProtocolHttpUrl.payStatusH5, sendData, (data)=>{
                            if(data.code == 200){
                                clearInterval(this.t);
                                App.EventManager.sendEvent(EventConst.REQ_GAME_INFO);
                                App.LoadingLock.unlock();
                            }
                        }, this);
                        pos++
                 }
             },10000);

            return false;
        }

    }

    /**IOS支付 */
    public sendIOSPay(order_id, payid) {
        //TODO 暂时屏蔽
        // App.LoadingLock.lock(null, null, false);
        // let data = { order_id: "", payId: "", authorization: "", url: "" }
        // data.order_id = "" + order_id;
        // data.payId = "" + payid;
        // data.authorization = "" + App.DataCenter.skey;
        // data.url = "" + ProtocolHttpUrl.giftForUser;
        // egret.ExternalInterface.call("iosPay", JSON.stringify(data));
    }   

    //android支付
    public sendAndroidPay(gid, goodsDes){
        //TODO 暂时屏蔽
        // let data = {gid, "token": App.DataCenter.skey, goodsDes};
        // egret.ExternalInterface.call("pay", JSON.stringify(data));
    }

    /**通知runtime加载页面已就绪,可以关闭runtime loading */
    public customLoadingFlag(){
        if (App.DeviceUtils.IsNative) {
            var json = { current: 10, total: 10 };
            var jsonStr = JSON.stringify(json);
            egret.ExternalInterface.call("customLoadingFlag", jsonStr);
        }
    }

    /**发送登录信息 */
    public sendNativeLogin(user: string) {
        console.log("u8Login<<<<<<<<<<<<<"+user);
        egret.ExternalInterface.call("u8Login", JSON.stringify(user));
    }

    /**接收登录信息 */
    private revNativeLogin(json) {
        console.log("u8Login>>>>>>>>>>>>"+json);
        let data = JSON.parse(json);

        let scene:LoginScene = App.SceneManager.getScene(SceneConst.LoginScene);
        if (scene && scene.ctrl.reqNativeLogin) {
            scene.ctrl.reqNativeLogin(data);
        }
        else {
            console.log("warn: login");
        }
    }

    /**发送支付 */
    public sendNativePay(data: any) {
        console.log("NativePay<<<<<<<<<<<<<"+JSON.stringify(data) );
        App.LoadingLock.lock(null, null, false, "支付中...");
        egret.ExternalInterface.call("pay", JSON.stringify(data));
    }

    /**接收支付 */
    private revPay(data) {
        console.log("NativePay>>>>>>>>>>>>>"+JSON.stringify(data) );
        App.LoadingLock.unlock();
        App.EventManager.sendEvent(EventConst.GIFTFORUSER,data);
    }
}