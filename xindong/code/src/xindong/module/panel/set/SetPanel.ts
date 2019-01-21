/**
 * 设置面板
 * @author xiongjian 
 * @date 2017/8/31
 */
class SetPanel extends BasePanel {

    public setGroup: eui.Group;
    public zhuName: eui.Label;
    public zhuId: eui.Label;
    public kaiguanGroup: eui.Group;
    public kaiguan: eui.ToggleSwitch;
    public jianyiGroup: eui.Group;
    public youjianGroup: eui.Group;
    public xin: eui.Image;
    public guanbiBtn: eui.Button;
    public sndLine:eui.Image;

    public constructor() {
        super();
        this.skinName = "SetPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        this.kaiguan.selected = true;
    }

    /**添加到场景中*/
    public onEnable() {
        if (App.DataCenter.mail && App.DataCenter.mail.length > 0) {
            this.xin.visible = true;
        } else {
            this.xin.visible = false;
        }

        this.kaiguan.addEventListener(egret.TouchEvent.CHANGE, this.yinyueTouch, this);
        this.jianyiGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.xieyiTouch, this);
        this.youjianGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.youjianTouch, this);

        CommomBtn.btnClick(this.guanbiBtn,this.close,this,2);

        this.zhuName.text = App.DataCenter.UserInfo.nickName;
        this.zhuId.text = App.DataCenter.UserInfo.uid;
        this.enterAnimation();
        this.musicOff();
    }

    /**从场景中移除*/
    public onRemove() {
        this.kaiguan.removeEventListener(egret.TouchEvent.CHANGE, this.playClick, this);
        this.jianyiGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.xieyiTouch, this);
        this.youjianGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.youjianTouch, this);

        CommomBtn.removeClick(this.guanbiBtn,this.close,this);
        
        egret.Tween.removeTweens(this.setGroup);
    }

    /**显示音乐开关 */
    private musicOff() {
        // if (App.LocalStorageUtil.allowMusic) {
        //     this.kaiguan.selected = true;
        //     this.sndLine.visible = false;
        // } else {
        //     this.kaiguan.selected = false;
        //     this.sndLine.visible = true;
        // }
    }

    /**音乐点击 */
    private yinyueTouch() {
        this.playClick();
        if (this.kaiguan.selected) {
            // App.LocalStorageUtil.allowMusic = true;
            // App.LocalStorageUtil.allowEffect = true;
            App.SoundManager.allowPlayBGM = true;
            App.SoundManager.allowPlayEffect = true;
            this.sndLine.visible = false;
        } else {
            // App.LocalStorageUtil.allowMusic = false;
            // App.LocalStorageUtil.allowEffect = false;
            App.SoundManager.allowPlayBGM = false;
            App.SoundManager.allowPlayEffect = false;
            this.sndLine.visible = true;
        }


    }

    /**关闭音乐点击 */
    private yinyue1Touch() {
        this.playClick();


    }

    /**邮件点击 */
    private youjianTouch() {
        this.playClick();
        // if (App.DataCenter.mail && App.DataCenter.mail.length > 0) {
            App.PanelManager.open(PanelConst.MailPanel);
            this.hide();
        // }
    }

    /**协议点击 */
    private xieyiTouch() {
        this.playClick();
        App.PanelManager.open(PanelConst.ProtocolPanel);
        this.hide();
    }

    /**播放点击音乐 */
    private playClick() {
        App.SoundManager.playEffect(SoundManager.click);
    }


    /**关闭按钮点击 */
    private close() {
        this.outAnimation(() => {
            let gameScene = <GameScene>App.SceneManager.getScene(SceneConst.GameScene);
            gameScene.enterAnimation();
            this.hide();
        });
    }

    /**显示心 */
    private showXin(bo: boolean) {
        if (bo) {
            this.xin.visible = true;
        } else {
            this.xin.visible = false;
        }
    }

    /**出场动画 */
    public outAnimation(finishCallback: Function = null) {
        egret.Tween.get(this.setGroup).set({ alpha: 1, scaleX: 1, scaleY: 1 }).to({ alpha: 0.4, scaleX: 0.4, scaleY: 0.4 }, 300).call(finishCallback);
    }

    /**入场动画 */
    public enterAnimation() {
        egret.Tween.get(this.setGroup).set({ alpha: 0.4, scaleX: 0.4, scaleY: 0.4 }).to({ alpha: 1, scaleX: 1.2, scaleY: 1.2 }, 300).to({ scaleX: 1, scaleY: 1 }, 100);
    }

}
