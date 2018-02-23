/**
 * 视频item 
 * @author xiongjian 
 * @date 2017/9/19
 */
class ShiPinScrollerItem extends BaseUI {

    public videoImg: eui.Image;
    public maskImg: eui.Image;
    public playImg: eui.Image;
    public lockImg: eui.Image;
    public goldGroup: eui.Group;
    public goldText: eui.Label;
    public dateText: eui.Label;
    public typeText: eui.Label;
    public dateGroup: eui.Group;

    public islock: true;

    public transData;

    public constructor() {
        super();
        this.skinName = "ShiPinScrollerItemSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    protected onEnable() {
        this.videoImg.mask = this.maskImg;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    /**从场景中移除*/
    protected onRemove() {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }

    /**点击 */
    private onTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        console.log("item", this.transData);
        let data = this.transData;
        //珍藏视频
        if (data.types == 1) {
            if (data.locked == 0) {
                if (App.DeviceUtils.IsIos && App.DeviceUtils.IsNative) {
                    let http = new HttpSender();
                    let param = { ossvid: data.ossvid };
                    http.post(ProtocolHttpUrl.videoPlay, param, this.urlBack, this);

                } else {
                    let http = new HttpSender();
                    let param = { ossvid: data.ossvid };
                    http.post(ProtocolHttpUrl.videoUrl, param, this.videoUrlBack, this);
                    console.log(data.ossvid);
                }
            } else {
                let dialog:ConfirmDialog = new ConfirmDialog();
                dialog.setTitle(LanConst.dialog0_00);
                dialog.setContent(LanConst.video0_00);
                dialog.show();
                dialog.setOk(()=>{
                    let http = new HttpSender();
                    let param = { vid: data.id };
                    http.post(ProtocolHttpUrl.videoBuy, param, this.buyBack, this);
                },this);
            }
        }

        //回忆视频 
        if (data.types == 0) {
            if (data.locked == 0) {
                if (App.DeviceUtils.IsIos && App.DeviceUtils.IsNative) {
                    let http = new HttpSender();
                    let param = { ossvid: data.ossvid };
                    http.post(ProtocolHttpUrl.videoPlay, param, this.urlBack, this);

                } else {
                    let http = new HttpSender();
                    let param = { ossvid: data.ossvid };
                    http.post(ProtocolHttpUrl.videoUrl, param, this.videoUrlBack, this);
                }
            } else {
                Tips.info("第" + data.days + "天开放")
            }
        }

    }

    /**web视频Url */
    public videoUrlBack(data) {
        if (data.code == 200) {
            console.log("url------", data.data.url);
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

    /**购买返回 */
    private buyBack(data) {
        if (data.code == 200) {
            this.transData.locked = 0;
            for (let i = 0; i < data.data.fav.length; i++) {
                if (data.data.fav[i].id == this.transData.id) {
                    this.transData.ossvid = data.data.fav[i].ossvid;
                }
            }
            App.DataCenter.Video = data.data;

            this.showPlay(true);
            this.showMask(false);
            this.showLock(false);
            this.showGoldGroup(false);

            App.DataCenter.UserInfo.gold = App.DataCenter.UserInfo.gold - this.transData.price;
            let panel = <ShipinPanel>App.PanelManager.getPanel(PanelConst.ShipinPanel);
            panel.setGoldtext(App.DataCenter.UserInfo.gold);

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

    /**设置数据 */
    public setData(data) {
        this.transData = data;
    }

    /**设置金币 */
    public setGoldText(str) {
        if (str != "") {
            this.goldText.text = str;
        }
    }

    /**设置视频图片 */
    public setVideoImg(url) {
        if (url && url != "") {
            this.videoImg.source = url;
        }
    }

    /**设置遮罩 */
    public showMask(boo) {
        if (boo) {
            this.maskImg.visible = true;
        } else {
            this.maskImg.visible = false;
        }
    }

    /**显示锁 */
    public showLock(boo) {
        if (boo) {
            this.lockImg.visible = true;
        } else {
            this.lockImg.visible = false;
        }
    }

    /**显示金币group */
    public showGoldGroup(boo) {
        if (boo) {
            this.goldGroup.visible = true;
        } else {
            this.goldGroup.visible = false;
        }
    }

    /**显示播放 */
    public showPlay(boo) {
        if (boo) {
            this.playImg.visible = true;
        } else {
            this.playImg.visible = false;
        }
    }

    /**显示天数 */
    public showDate(boo) {
        if (boo) {
            this.dateGroup.visible = true;
        } else {
            this.dateGroup.visible = false;
        }

    }

    /**设置游戏开启时间 */
    public setDateText(str) {
        if (str != "") {
            this.dateText.text = str;
        }
    }


    /**设置类型text */
    public setTypeText(str) {
        if (str != "") {
            this.typeText.text = str;
        }
    }



}

