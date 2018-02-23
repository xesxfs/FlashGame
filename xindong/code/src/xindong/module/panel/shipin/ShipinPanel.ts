/**
 * 视频面板
 * @author xiongjian
 * @date 2017-9-15
 */
class ShipinPanel extends BasePanel {

    public backBtn: eui.Button;
    public jinbiImg: eui.Image;
    public goldLabel: eui.Label;
    public shoucangScroller: eui.Scroller;
    public itemGroup: eui.Group;
    public huiyiScroller: eui.Scroller;
    public item2Group: eui.Group;
    public kaiguan: eui.ToggleSwitch;
    public goldGroup: eui.Group;


    /**引导 */
    public yindaoGroup: eui.Group;
    public yd_shipinImg: eui.Image;
    public shipinHand: eui.Image;

    private handX:number;


    public constructor() {
        super();
        this.skinName = "ShipinPanelSkin";
    }


    /**组件创建完毕*/
    protected childrenCreated() {
        this.handX = this.shipinHand.x;
    }

    /**添加到场景中*/
    public onEnable() {
        this.addItem();
        this.openLibao();
        this.yd_shipinImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_shipinImgTouch, this);
        this.kaiguan.selected = false;
        this.setGoldtext(App.DataCenter.UserInfo.gold);
        this.kaiguanTouch();
        // this.backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
        this.kaiguan.addEventListener(egret.TouchEvent.CHANGE, this.kaiguanTouch, this);
        this.goldGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);
        CommomBtn.btnClick(this.backBtn, this.close, this, 2);
        this.setGuide();

        App.EventManager.addEvent(EventConst.UPDATE_LIBAO, this.updateSiwei, this);
    }

    /**从场景中移除*/
    public onRemove() {
        this.yd_shipinImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.yd_shipinImgTouch, this);
        this.kaiguan.removeEventListener(egret.TouchEvent.CHANGE, this.kaiguanTouch, this);
        this.goldGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goldGroupTouch, this);

        CommomBtn.removeClick(this.backBtn, this.close, this);
    }

   

    /**引导方块点击 */
    private yd_shipinImgTouch() {
        console.log("点击方块");
        let http = new HttpSender();
        let param = {};
        http.post(ProtocolHttpUrl.guideDone, param, this.finishGuideBack, this);


    }

    /**引导完成返回 */
    private finishGuideBack(data) {
        if (data.code == 200) {
            this.yindaoGroup.visible = false;
            egret.Tween.removeTweens(this.shipinHand);
            App.DataCenter.shipinGuide = false;
            App.DataCenter.guide.fill_nick_name = data.data.fill_nick_name;
            App.DataCenter.guide.emph_zone = data.data.emph_zone;
            App.DataCenter.guide.video = data.data.video;

            let json = App.DataCenter.Video.mem[0];
            //回忆视频 
            if (json.types == 0) {
                if (json.locked == 0) {
                    if (App.DeviceUtils.IsIos && App.DeviceUtils.IsNative) {
                        let http = new HttpSender();
                        let param = { ossvid: json.ossvid };
                        http.post(ProtocolHttpUrl.videoPlay, param, this.urlBack, this);

                    } else {
                        let http = new HttpSender();
                        let param = { ossvid: json.ossvid };
                        http.post(ProtocolHttpUrl.videoUrl, param, this.videoUrlBack, this);
                    }
                } else {
                    Tips.info("第" + json.days + "天开放")
                }
            }
        } else {
            Tips.info("" + data.info);
        }
    }

    /**web视频Url */
    public videoUrlBack(data) {
        if (data.code == 200) {
            console.log("url--------------", data.data.url);
            if(App.DeviceUtils.IsWeb){
                 if(App.DeviceUtils.isMobile){
                     let dialog:PlayVideoDialog = new PlayVideoDialog();
                     dialog.setContent("观看视频");
                     dialog.setOk(()=>{
                        App.EventManager.sendEvent(EventConst.PLAY_WEB_VIDEO, data.data.url);
                     },this);
                     dialog.show(false);
                 }else{
                     App.EventManager.sendEvent(EventConst.PLAY_WEB_VIDEO, data.data.url);
                 }
            }else if(App.DeviceUtils.IsAndroid){
                App.NativeBridge.sendPlayVideo("2", data.data.url);
            }
          
        } else {
            Tips.info("" + data.info);
        }
    }

    /**请求视频Url */
    private urlBack(data) {
        if (data.code == 200) {
   
            App.NativeBridge.sendPlayVideo("2", data.data);
            
        } else {
            Tips.info("" + data.info);
        }
    }

    

    /**添加选项 */
    private addItem() {
        this.itemGroup.removeChildren();
        this.item2Group.removeChildren();

        let video = App.DataCenter.Video;
        let fav = video.fav;
        let mem = video.mem;
        console.log("fav", video.fav);
        for (let i = 0; i < fav.length; i++) {
            let data = fav[i];
            let item = new ShiPinScrollerItem();

            item.showDate(false);
            let type = "珍藏" + (i + 1);
            item.setTypeText(type);
            item.setVideoImg(data.preview);
            if (data.locked == 0) {
                item.showMask(false);
                item.showLock(false);
                item.showPlay(true);
                item.showGoldGroup(false);
            } else {
                item.showMask(true);
                item.showLock(true);
                item.showPlay(false);
                item.showGoldGroup(true);
                item.setGoldText(data.price);
            }

            item.setData(data);

            item.x = (i % 3) * (35 + 366) + 40;
            item.y = (Math.floor(i / 3)) * (35 + 287) + 40;
            this.itemGroup.addChild(item);
        }

        for (let k = 0; k < mem.length; k++) {
            let data = mem[k];
            let item1 = new ShiPinScrollerItem();
            item1.showGoldGroup(false);

            let type = "回忆" + (k + 1);
            item1.setTypeText(type);
            item1.setVideoImg(data.preview);
            if (data.locked == 0) {
                item1.showMask(false);
                item1.showLock(false);
                item1.showPlay(true);
                item1.showDate(false);
            } else {
                item1.showMask(true);
                item1.showLock(true);
                item1.showPlay(false);
                item1.showDate(true);
                let date = "游戏第" + data.days + "天开放"
                item1.setDateText(date);
            }

            item1.setData(data);

            item1.x = (k % 3) * (35 + 366) + 40;
            item1.y = (Math.floor(k / 3)) * (35 + 287) + 40;
            this.item2Group.addChild(item1);
        }


    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {

    }

    /**入场动画 */
    public enterAnimation() {

    }

    /**关闭 */
    private close() {
        this.hide();
        var gamescene = App.SceneManager.getScene(SceneConst.GameScene) as GameScene;
        gamescene.enterAnimation();
    }

    /**设置金币 */
    public setGoldtext(str) {
        if (str != "") {
            this.goldLabel.text = str;
        }
    }

    /**显示收藏或回忆 */
    private kaiguanTouch() {
        if (this.kaiguan.selected) {
            this.huiyiScroller.visible = false;
            this.shoucangScroller.visible = true;
            App.SoundManager.playEffect(SoundManager.button);
        } else {
            this.huiyiScroller.visible = true;
            this.shoucangScroller.visible = false;
            App.SoundManager.playEffect(SoundManager.button);
        }
    }

    /**金币Group点击 */
    public goldGroupTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        App.PanelManager.open(PanelConst.ShopPanel, 1);
        let shop = <ShopPanel>App.PanelManager.getPanel(PanelConst.ShopPanel);
        shop.isBack = true;
    }

    /**引导 */
    
    public setGuide() {
        if (App.DataCenter.shipinGuide) {
            this.yindaoGroup.visible = true;
            egret.Tween.get(this.shipinHand, { loop: true })
            .set({ x: this.handX})
            .to({ x: this.handX-40}, 600)
            .to({ x: this.handX}, 800)
            .wait(100);
        }
    }

    /**弹礼包面板 */
    public openLibao() {
        //如果未购买礼包，则显示购买珍藏视频礼包
        if(App.DataCenter.keybuy.shiping.hasbuy == false){
            let num = Math.floor(Math.random() * App.DataCenter.UserInfo.randNum) + 1
            console.log("num" + num, App.DataCenter.keybuy.shiping.hasbuy);
            if (num == 1 && !App.DataCenter.keybuy.shiping.hasbuy && App.DataCenter.guide.emph_zone != "ZONE_VIDEO") {
                App.PanelManager.open(PanelConst.LibaoVideoPanel);
            }
        }
    }

    /**更新数据 */
    private updateSiwei() {
        this.addItem();
        this.setGoldtext(App.DataCenter.UserInfo.gold);
    }

}