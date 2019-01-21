/**
 * 收藏Item
 * @author sven
 * 2017.12.27
 */
class CollectionItem extends eui.ItemRenderer {
    private itemImg: eui.Image;
    private lockGro: eui.Group;

    private nameGro: eui.Group;
    private nameLab: eui.Label;

    private goldGro: eui.Group;
    private goldLab: eui.Label;

    private chipGro: eui.Group;
    private chipLab: eui.Label;

    private musicGro: eui.Group;
    private changeMusicBtn: eui.Button;

    private playGro:eui.Group;
    private descGro:eui.Group;
    private descLab:eui.Label;
    private usingGro:eui.Group;
    private bgmImg:eui.Image;

    /**使用Group */
    private treasureGro: eui.Group;
    private useBgBtn: eui.Button;

    private thisData: CollectionVo;

    public constructor() {
        super();
        this.skinName = "CollectionItemSkin";
    }

    protected childrenCreated() {
        this.changeMusicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChange, this);
        this.useBgBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUse, this);
        this.lockGro.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLock, this);
        this.playGro.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPlay, this);
    }

    private onPlay() {
        console.log("CollectionItem >> 请求收藏视频");
        let http = new HttpSender();
        let param = { vname: this.thisData.ossvid };
        http.post(ProtocolHttpUrl.videoUrl, param, this.revPlay, this);
    }

    /**播放视频 */
    private revPlay(data) {
        console.log("CollectionItem >> 请求收藏视频成功");
        if (data.code == 200) {
            // 收藏内视频全部可跳过
            App.NativeBridge.sendPlayVideo(VideoType.fav, data.data.url);
        } else {
            Tips.info(data.info);
        }
    }

    private onChange() {
        let clickData = this.thisData;
        let http = new HttpSender();
        let data = ProtocolHttp.bgmBuyOrUse;
        data.bid = clickData.id;
        http.post(ProtocolHttpUrl.setBgm, data, this.revUseBgm, this);
    }

    /**更换音乐 */
    private revUseBgm(data) {
        if(data.code == 200){
            if (this.thisData.uri.length > 5) {
                App.DataCenter.UserInfo.bgm = this.thisData.uri;
                SoundManager.bgm = this.thisData.uri;
                App.SoundManager.playBGM(SoundManager.bgm);

                let listBgm = App.DataCenter.collectionInfo.bgMus;
                for (let i = 0;i < listBgm.length;i ++) {
                    listBgm[i].use_status = 0;
                    if (this.thisData.localTypes == CollectionType.BgMus && this.thisData.id == listBgm[i].id) {
                        listBgm[i].use_status = 1;
                    }
                }
                let panel:CollectionPanel = <CollectionPanel>App.PanelManager.getPanel(PanelConst.CollectionPanel);
                panel.reListUI();
                Tips.info("更换成功");
            }
            else {
                console.warn("锤子URL");
            }
		}else{
			Tips.info(data.info);
		}
    }

    private onUse() {
        let clickData = this.thisData;

        if (clickData.localTypes == CollectionType.BgImg) {
            let http = new HttpSender();
            let data = ProtocolHttp.bgiBuyOrUse;
            data.bid = clickData.id;
            http.post(ProtocolHttpUrl.setBgi, data, this.revUseBgi, this);
        }
        else if (clickData.localTypes == CollectionType.GiftImg) {
            let http = new HttpSender();
            let data = ProtocolHttp.gitBgi;
            data.bid = clickData.id;
            http.post(ProtocolHttpUrl.setGiftBgi, data, this.revGiftBgi, this);
        }
    }

    /**赠礼背景 */
    private revGiftBgi(data) {
        if(data.code == 200) {
            let giftbgi = App.DataCenter.collectionInfo.giftBgi;
            for (let i = 0;i < giftbgi.length;i ++) {
                giftbgi[i].use_status = 0;
                if (this.thisData.localTypes == CollectionType.GiftImg && this.thisData.id == giftbgi[i].id) {
                    giftbgi[i].use_status = 1;
                }
            }
            let panel:CollectionPanel = <CollectionPanel>App.PanelManager.getPanel(PanelConst.CollectionPanel);
            panel.reListUI();
            Tips.info("更换成功");
        }
        else {
            Tips.info(data.info);
        }
    }

    /**使用背景 */
    private revUseBgi(data) {
        if(data.code == 200){
            if (this.thisData.uri.length > 5) {
                App.DataCenter.UserInfo.bgi = this.thisData.uri;
                (<GameScene>App.SceneManager.getScene(SceneConst.GameScene)).changeBgImg();
                let panel:CollectionPanel = <CollectionPanel>App.PanelManager.getPanel(PanelConst.CollectionPanel);
                panel.changeBgi();

                let listBgi = App.DataCenter.collectionInfo.bgImg;
                for (let i = 0;i < listBgi.length;i ++) {
                    listBgi[i].use_status = 0;
                    if (this.thisData.localTypes == CollectionType.BgImg && this.thisData.id == listBgi[i].id) {
                        listBgi[i].use_status = 1;
                    }
                }
                panel.reListUI();
            }
            else {
                console.warn("锤子URL");
            }
		}else{
			Tips.info(data.info);
		}
    }

    /**前往赠送礼物 */
    private onGift() {
        let http:HttpSender = new HttpSender;
        http.post(ProtocolHttpUrl.giftList, {}, this.revGift, this);
    }

    private revGift(data) {
        if(data.code == 200){
            App.DataCenter.interactGiftInfo.readData(data.data)
            App.PanelManager.getCurPanel().hide();
			App.PanelManager.open(PanelConst.InteractGiftPanel);
		}else{
			Tips.info(data.info);
		}
    }

    /**前往活动中心幸运抽奖 */
    private onLucky() {
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.actList, {}, this.revLucky, this);
    }

    private revLucky(data) {
        if(data.code == 200){
			App.DataCenter.actInfo.readData(data.data);
            App.PanelManager.getCurPanel().hide();
			App.PanelManager.open(PanelConst.ActPanel, ActPage.Lucky);
		}else{
			Tips.info(data.info);
		}
    }

    private onLock() {
        let clickData = this.thisData;

        if (clickData.localTypes == CollectionType.BgImg) {
            let ownGold = App.DataCenter.UserInfo.gold;
            if (ownGold < clickData.cons) {
                let dialog:ConfirmDialog = new ConfirmDialog();
                dialog.setLackCurrency(1);
                dialog.show();
            }
            else {
                let dialog:ConfirmDialog = new ConfirmDialog();
                dialog.setCollectionGold(clickData.cons);
                dialog.setOk(this.unLockBgi, this);
                dialog.show();
            }
        }
        else if (clickData.localTypes == CollectionType.BgMus) {
            let ownGold = App.DataCenter.UserInfo.gold;
            if (ownGold < clickData.cons) {
                let dialog:ConfirmDialog = new ConfirmDialog();
                dialog.setLackCurrency(1);
                dialog.show();
            }
            else {
                let dialog:ConfirmDialog = new ConfirmDialog();
                dialog.setCollectionGold(clickData.cons);
                dialog.setOk(this.unLockBgm, this);
                dialog.show();
            }
        }
        else if (clickData.localTypes == CollectionType.GiftImg || clickData.localTypes == CollectionType.GiftVedio) {
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setContent("赠礼值不足，是否前往互动赠礼?");
            dialog.setOk(this.onGift, this);
            dialog.show();
        }
        else if (clickData.localTypes == CollectionType.Treasure) {
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setContent("碎片数量不足，是否前往幸运抽奖抽取碎片？");
            dialog.setOk(this.onLucky, this);
            dialog.show();
        }
        else {
            console.log("有钱就能为所欲为？")
            return;
        }
    }

    /**解锁动画 */
    private showUnlockAnim() {
        let mc = new BaseMovieClip();
        mc.config("guide_lock_mc_json", "guide_lock_tex_png", "guide_lock");
        mc.x = this.lockGro.width/2;
        mc.y = this.lockGro.height/2;
        this.lockGro.addChild(mc);
        mc.addEventListener(egret.Event.COMPLETE, ()=>{
            this.lockGro.visible = false;
            if (mc && mc.parent) {
                mc.parent.removeChild(mc);
            }
        }, this)
        
        mc.play();
        this.lockGro.getChildAt(1).visible = false;

        setTimeout(()=>{
            App.SoundManager.playEffect("unlock_mp3");
        }, 500);
    }

    /**解锁背景图 */
    private unLockBgi() {
        let clickData = this.thisData;
        let http = new HttpSender();
        let data = ProtocolHttp.bgiBuyOrUse;
        data.bid = clickData.id;
        http.post(ProtocolHttpUrl.buyBgi, data, this.reBuyLockImg, this);
    }

    private reBuyLockImg(data) {
        if(data.code == 200){
            App.DataCenter.reUserBase(data.data);
            this.treasureGro.visible = true;
            this.goldGro.visible = false;

            this.showUnlockAnim();
            let list = App.DataCenter.collectionInfo.bgImg;
            for (let i = 0;i < list.length;i ++) {
                if (list[i].id == this.thisData.id) {
                    list[i].locked = 0;
                }
            }
		}else{
			Tips.info(data.info);
		}
    }

    /**解锁背景音乐 */
    private unLockBgm() {
        let clickData = this.thisData;
        let http = new HttpSender();
        let data = ProtocolHttp.bgmBuyOrUse;
        data.bid = clickData.id;
        http.post(ProtocolHttpUrl.buyBgm, data, this.reBuyLockBgm, this);
    }

    private reBuyLockBgm(data) {
        if(data.code == 200){
            App.DataCenter.reUserBase(data.data);
            this.musicGro.visible = true;
            this.goldGro.visible = false;
            
            this.showUnlockAnim();
            let list = App.DataCenter.collectionInfo.bgMus;
            for (let i = 0;i < list.length;i ++) {
                if (list[i].id == this.thisData.id) {
                    list[i].locked = 0;
                }
            }
		}else{
			Tips.info(data.info);
		}
    }

    protected dataChanged() {
        let itemData: CollectionVo = this.data;
        this.thisData = itemData;
        this.itemImg.y = 0;

        switch (itemData.localTypes) {
            case CollectionType.BgImg:
                this.setBgImg();
                break;
            case CollectionType.Recall:
                this.setRecall();
                break;
            case CollectionType.Treasure:
                this.setTreasure();
                break;
            case CollectionType.BgMus:
                this.setBgm();
                break;
            case CollectionType.GiftImg:
                this.setGiftBgImg();
                break;
            case CollectionType.GiftVedio:
                this.setGiftVedio();
                break;
            default:
                break;
        }
    }

    /**背景图片 */
    private setBgImg() {
        this.playGro.visible = false;
        this.nameGro.visible = false;
        this.chipGro.visible = false;
        this.musicGro.visible = false;
        this.descGro.visible = false;
        this.bgmImg.visible = false;

        let itemData = this.thisData;

        this.itemImg.source = itemData.uri + "_preview_png";

        if (itemData.locked  == 1) {
            this.lockGro.visible = true;
            this.goldGro.visible = true;
            this.goldLab.text = itemData.cons + "";
            this.treasureGro.visible = false;
        }
        else {
            this.lockGro.visible = false;
            this.goldGro.visible = false;

            if (itemData.use_status) {
                this.usingGro.visible = true;
                this.treasureGro.visible = false;
            }
            else {
                this.usingGro.visible = false;
                this.treasureGro.visible = true;
            }
        }
    }

    /**送礼背景图 */
    private setGiftBgImg() {
        this.playGro.visible = false;
        this.nameGro.visible = false;
        this.chipGro.visible = false;
        this.musicGro.visible = false;
        this.goldGro.visible = false;
        this.bgmImg.visible = false;

        let itemData = this.thisData;

        this.itemImg.source = itemData.preview;

        if (itemData.lock == 1) {
            this.lockGro.visible = true;
            this.treasureGro.visible = false;
            this.descGro.visible = true;
            this.descLab.text = "送礼满"+itemData.hearts+"解锁";
        }
        else {
            this.lockGro.visible = false;
            
            if (itemData.use_status) {
                this.usingGro.visible = true;
                this.treasureGro.visible = false;
            }
            else {
                this.usingGro.visible = false;
                this.treasureGro.visible = true;
            }

            this.descGro.visible = false;
        }
    }

    /**回忆视频 */
    private setRecall() {
        this.nameGro.visible = false;
        this.chipGro.visible = false;
        this.musicGro.visible = false;
        this.usingGro.visible = false;
        this.treasureGro.visible = false;
        this.goldGro.visible = false;
        this.bgmImg.visible = false;

        let itemData = this.thisData;

        this.itemImg.source = itemData.preview;

        if (itemData.locked  == 1) {
            this.lockGro.visible = true;
            this.playGro.visible = false;
            this.descGro.visible = true;
            this.descLab.text = "恋爱第"+itemData.days+"天解锁";
        }
        else {
            this.lockGro.visible = false;
            this.playGro.visible = true;
            this.descGro.visible = false;
        }
    }

    /**送礼视频 */
    private setGiftVedio() {
        this.nameGro.visible = false;
        this.chipGro.visible = false;
        this.musicGro.visible = false;
        this.usingGro.visible = false;
        this.treasureGro.visible = false;
        this.goldGro.visible = false;
        this.bgmImg.visible = false;

        let itemData = this.thisData;

        this.itemImg.source = itemData.preview;

        if (itemData.lock  == 1) {
            this.lockGro.visible = true;
            this.playGro.visible = false;
            this.descGro.visible = true;
            this.descLab.text =  "送礼满"+itemData.hearts+"解锁";
        }
        else {
            this.lockGro.visible = false;
            this.playGro.visible = true;
            this.descGro.visible = false;
        }
    }

    /**珍藏视频 */
    private setTreasure() {
        this.musicGro.visible = false;
        this.usingGro.visible = false;
        this.treasureGro.visible = false;
        this.goldGro.visible = false;
        this.descGro.visible = false;
        this.bgmImg.visible = false;

        let itemData = this.thisData;

        this.itemImg.source = itemData.preview;

        this.nameGro.visible = true;
        this.nameLab.text = itemData.name;
        if (itemData.locked  == 1) {
            this.lockGro.visible = true;
            this.playGro.visible = false;
            this.chipGro.visible = true;
            this.chipLab.text = itemData.piece + "/" + itemData.cons;
        }
        else {
            this.lockGro.visible = false;
            this.playGro.visible = true;
            this.chipGro.visible = false;
        }
    }

    /**背景音乐 */
    private setBgm() {
        this.nameGro.visible = false;
        this.treasureGro.visible = false;
        this.nameGro.visible = true;
        this.playGro.visible = false;
        this.descGro.visible = false;
        this.chipGro.visible = false;
        this.bgmImg.visible = true;

        let itemData = this.thisData;

        this.itemImg.source = "col_bgm_bg_png";
        this.itemImg.y = 3;
        this.nameLab.text = itemData.title;

        if (itemData.locked  == 1) {
            this.lockGro.visible = true;
            this.goldGro.visible = true;
            this.goldLab.text = itemData.cons + "";
            this.musicGro.visible = false;
        }
        else {
            this.lockGro.visible = false;
            this.goldGro.visible = false;
            if (itemData.use_status == 1) {
                this.usingGro.visible = true;
                this.musicGro.visible = false;
                egret.Tween.get(this.bgmImg, {loop: true})
                .to({rotation: 360}, 10000)
            }
            else {
                this.usingGro.visible = false;
                this.musicGro.visible = true;
                egret.Tween.removeTweens(this.bgmImg);
            }
        }
    }
}