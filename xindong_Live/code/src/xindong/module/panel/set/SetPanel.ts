/**
 * 设置面板
 * @author xiongjian 
 * @date 2017/8/31
 */
class SetPanel extends BasePanel {

    public nameLabel: eui.Label;        //昵称
    public idLabel: eui.Label;          //角色ID
    private bindBtn: eui.Button;         //绑定手机

    private bgmBtn: eui.ToggleButton;    //背景音乐开关
    private effectBtn: eui.ToggleButton; //音效开关

    private proGroup: eui.Group;         //协议
    private freeBackGroup: eui.Group;    //反馈
    private mailGroup: eui.Group;        //邮件

    private redTip: eui.Image;           //红点提示
    private qqLabel: eui.Label;          //QQ和微信公众号
    private closeBtn: eui.Button;        //关闭

    private choosImg: eui.Image;
    private musLab: eui.Label;
    private selectList: SelectList;

    public constructor() {
        super();
        this.skinName = "SetPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {

    }

    /**添加到场景中*/
    public onEnable() {
        //入场动画
        this.playEnterAnim();
        //昵称和id
        this.nameLabel.text = App.DataCenter.UserInfo.nickName;
        this.idLabel.text = App.DataCenter.UserInfo.id + "";
        //红点提示
        if (App.DataCenter.mail && App.DataCenter.mail.length > 0) {
            this.redTip.visible = true;
        } else {
            this.redTip.visible = false;
        }
        // 绑定、退出登录按钮
        if (App.DataCenter.UserInfo.role) {
            this.bindBtn.label = "退出账号";
        }
        else {
            this.bindBtn.label = "绑定手机";
        }
        //微信和qq
        this.qqLabel.text = "客服QQ：" + App.DataCenter.UserInfo.qq + "     微信公众号：" + App.DataCenter.UserInfo.wechat;
        //音乐开关
        this.bgmBtn.selected = !App.SoundManager.allowPlayBGM;
        this.effectBtn.selected = !App.SoundManager.allowPlayEffect;
        //按钮监听
        this.bgmBtn.addEventListener(egret.TouchEvent.CHANGE, this.onBgmTouch, this);
        this.effectBtn.addEventListener(egret.TouchEvent.CHANGE, this.onEffectTouch, this);
        this.proGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onProTouch, this);
        this.freeBackGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onFreeBackTouch, this);
        this.mailGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMailTouch, this);
        this.choosImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChoose, this);

        CommomBtn.btnClick(this.bindBtn, this.onBindTouch, this);
        CommomBtn.btnClick(this.closeBtn, this.onClose, this, ComBtnType.Close);

        this.createSelect();
    }

    /**从场景中移除*/
    public onRemove() {
        this.bgmBtn.removeEventListener(egret.TouchEvent.CHANGE, this.onBgmTouch, this);
        this.effectBtn.removeEventListener(egret.TouchEvent.CHANGE, this.onEffectTouch, this);
        this.proGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onProTouch, this);
        this.freeBackGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onFreeBackTouch, this);
        this.mailGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onMailTouch, this);
        this.choosImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChoose, this);
        this.selectList && this.removeChild(this.selectList);

        CommomBtn.removeClick(this.bindBtn, this.onBindTouch, this);
        CommomBtn.removeClick(this.closeBtn, this.onClose, this);
    }

    /**背景音乐点击 */
    private onBgmTouch() {
        this.playClick();
        if (this.bgmBtn.selected) {
            App.SoundManager.allowPlayBGM = false;
            App.SoundManager.stopBGM();
        } else {
            App.SoundManager.allowPlayBGM = true;
            App.SoundManager.playBGM(SoundManager.bgm);
        }
    }

    /**音效点击 */
    private onEffectTouch() {
        this.playClick();
        if (this.effectBtn.selected) {
            App.SoundManager.allowPlayEffect = false;
        } else {
            App.SoundManager.allowPlayEffect = true;
        }
    }

    /**邮件点击 */
    private onMailTouch() {
        this.playClick();
        App.PanelManager.open(PanelConst.MailPanel);
        this.hide();
    }

    /**协议点击 */
    private onProTouch() {
        this.playClick();
        App.PanelManager.open(PanelConst.ProtocolPanel);
        this.hide();
    }

    /**反馈点击 */
    private onFreeBackTouch() {
        this.playClick();
        App.PanelManager.open(PanelConst.FeedBackPanel);
        this.hide();
    }

    /**播放点击音乐 */
    private playClick() {
        App.SoundManager.playEffect(SoundManager.click);
    }

    /**绑定手机、退出登录点击 */
    private onBindTouch() {
        if (App.DataCenter.UserInfo.role) {
            let dialog: ConfirmDialog = new ConfirmDialog();
            dialog.setContent("确定退出登录？");
            dialog.setOk(() => {
                App.EventManager.sendEvent(EventConst.LOGIN_OUT);
            }, this);
            dialog.show();
        }
        else {
            this.hide();
            App.PanelManager.open(PanelConst.BindPhonePanel);
        }
    }

    /**关闭按钮点击 */
    private onClose() {
        let gameScene = <GameScene>App.SceneManager.getScene(SceneConst.GameScene);
        gameScene.enterAnimation();
        this.hide();
    }

    /**创建下拉列表 */
    private createSelect() {
        this.selectList = new SelectList("set_box0_png");
        let cfg = {
            width: 410,
            maxHeight: 200,
            itemHeight: 50,
            callBack: this.chooseList.bind(this),
            dataList: [1,1,1,1,1,1]
        }
        this.selectList.initCfg(cfg);
        this.selectList.x = 603;
        this.selectList.y = 353;
        this.addChild(this.selectList);
        this.selectList.visible = false;
    }

    /**选择音乐 */
    private onChoose() {
        this.selectList.visible = !this.selectList.visible;
    }

    /**列表选择回调 */
    private chooseList(data: any) {
        this.selectList.visible = false;
        
        // todo 根据数据设置音乐名
    }
}
