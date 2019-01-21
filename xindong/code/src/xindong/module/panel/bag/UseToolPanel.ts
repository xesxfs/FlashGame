/**
 * 使用道具面板
 * @author xiongjian 
 * @date 2017-9-22
 */
class UseToolPanel extends BasePanel {
    public recData;
    public bgImg: eui.Image;
    public titleLabel: eui.Label;
    public contentLabel: eui.Label;
    public giftImg: eui.Image;
    public jianBtn: eui.Button;
    public jiaBtn: eui.Button;
    public countLabel: eui.Label;
    public nojianBtn: eui.Button;
    public nojiaBtn: eui.Button;
    public canelBtn: eui.Button;
    public okBtn: eui.Button;
    public myCount: eui.Label;
    private canelMidBtn:eui.Button;  //不可使用道具，只显示中间关闭按钮

    private count = 1;


    public constructor() {
        super();
        this.skinName = "useToolPanelSkin";
    }

    /**组件创建完毕*/
    protected childrenCreated() {
        
    }

    /**添加到场景中*/
    public onEnable(data:any = null) {
        this.recData = data;
        this.playEnterAnim();
        this.count = 1;
        this.init();
        console.log("transdata", this.recData);

        
        
        CommomBtn.btnClick(this.okBtn,this.okTouch,this,1);
        CommomBtn.btnClick(this.canelBtn,this.canelTouch,this,1);
        CommomBtn.btnClick(this.jianBtn,this.jianTouch,this,1);
        CommomBtn.btnClick(this.jiaBtn,this.jiaTouch,this,1);
        CommomBtn.btnClick(this.canelMidBtn, this.close, this, 1);

        this.jiaBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jiaBtnTouchBegin, this);
        this.jianBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jianBtnTouchBegin, this);
        this.bgImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bgTouch, this);
        App.StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
    }

    /**从场景中移除*/
    public onRemove() {
        CommomBtn.removeClick(this.okBtn,this.okTouch,this);
        CommomBtn.removeClick(this.canelBtn,this.canelTouch,this);
        CommomBtn.removeClick(this.jianBtn,this.jianTouch,this);
        CommomBtn.removeClick(this.jiaBtn,this.jiaTouch,this);
        CommomBtn.removeClick(this.canelMidBtn, this.close, this);

        this.jiaBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jiaBtnTouchBegin, this);
        this.jianBtn.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jianBtnTouchBegin, this);
        this.bgImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.bgTouch, this);
        App.StageUtils.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
    }

    /**确定点击 */
    private okTouch() {
        if (this.recData && this.recData.id) {
            let http = new HttpSender();
            let param = { gid: 0, count: 0 }
            param.gid = this.recData.id;
            param.count = this.count;
            http.post(ProtocolHttpUrl.useTool, param, this.useBtnTouchBack, this);
        }
    }

    /**购买返回 */
    private useBtnTouchBack(data) {
        console.log("tool", data);
        if (data.code == 200) {
            this.close();
            if(data.data.hearts - App.DataCenter.UserInfo.hearts!=0){
                 TipsHeat.showHeat(data.data.hearts - App.DataCenter.UserInfo.hearts);
            }
           
            
            App.DataCenter.UserInfo.diamond = data.data.diamond;
            App.DataCenter.UserInfo.gold = data.data.gold;
            App.DataCenter.UserInfo.hearts = data.data.hearts;
            App.DataCenter.UserInfo.power = data.data.power;
            console.log("recData",this.recData);
            if(this.recData.id == 37){
                let exp = data.data.exps - App.DataCenter.UserInfo.exps;
                Tips.info("增加"+ exp +"工作经验");
                 App.DataCenter.UserInfo.exps = data.data.exps;
                 
            }

            let panel = <BagsPanel>App.PanelManager.getPanel(PanelConst.BagsPanel);
            panel.setXinText(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
            this.getBags();
        } else {
            Tips.info("" + data.info);
        }
    }

    /**请求背包数据 */
    private getBags(){
        let http = new HttpSender();
        http.post(ProtocolHttpUrl.bags, {}, this.dataBack, this);
    }
    /**背包数据返回 */
	private dataBack(data) {
		if (data.code == 200) {
			App.DataCenter.Bags = data.data;
			let gameScene = <GameScene>App.SceneManager.getScene(SceneConst.GameScene);
			gameScene.outAnimation(() => {
				let panel = <BagsPanel>App.PanelManager.getPanel(PanelConst.BagsPanel);
                panel.init();
                
			});
		}
	}

    /**设置数据 */
    private init() {
        this.showHuijia(false);
        this.showHuijian(false);
        this.setCountLabel(this.count);
        this.setContentLabel(this.recData.des);
        this.setTitleLabel(this.recData.cname);
        this.setGiftImg(this.recData.pic);
        this.setMyCount(this.recData.count);
        this.setToolCanUse();
    }

    /**取消点击 */
    private canelTouch() {
        this.close();
    }

    /**加点击 */
    private jiaTouch() {
        this.count += 1
        this.showHuijian(false);
        if (this.count > this.recData.count) {
            this.showHuijia(true);
            this.count -=1;
        } else {
            this.showHuijia(false);
            App.SoundManager.playEffect(SoundManager.number_add);
        }
        this.setCountLabel(this.count);
        

    }

    /**减点击 */
    private jianTouch() {
        this.showHuijia(false);
        if (this.count > 1) {
            this.count -= 1;
            this.showHuijian(false);
            App.SoundManager.playEffect(SoundManager.number_reduce);
        } else {
            this.count = 1;
            this.showHuijian(true);
        }
        this.setCountLabel(this.count);
        
    }

    /**加点击开始 */
    private jiaBtnTouchBegin() {
        egret.Tween.get(this.jiaBtn,{loop:true}).wait(100).call(()=>{
            this.jiaTouch();
        },this);
    }

    /**减点击开始 */
    private jianBtnTouchBegin() {
        egret.Tween.get(this.jianBtn,{loop:true}).wait(100).call(()=>{
            this.jianTouch();
        },this);
    }

    /**加点击或减点击结束 */
    private onStageTouchEnd() {
        egret.Tween.removeTweens(this.jiaBtn);
        egret.Tween.removeTweens(this.jianBtn);
    }

    /**背景点击 */
    private bgTouch() {
        this.close();
    }

    /**礼物图片设置 */
    private setGiftImg(url) {
        if (url && url != "") {
            this.giftImg.source = url;
        }
    }


    /**内容设置 */
    private setContentLabel(str) {
        if (str != "") {
            this.contentLabel.text = str;
        }
    }

    /**标题设置 */
    private setTitleLabel(str) {
        if (str != "") {
            this.titleLabel.text = str;
        }
    }

    /**设置购买数量 */
    private setCountLabel(num) {
        if (num != "") {
            this.countLabel.text = num;
        }
    }


    /**显示加灰色 */
    private showHuijia(bo: boolean) {
        if (bo) {
            this.nojiaBtn.visible = true;
        } else {
            this.nojiaBtn.visible = false;
        }

    }

    /**显示减灰色 */
    private showHuijian(bo: boolean) {
        if (bo) {
            this.nojianBtn.visible = true;
        } else {
            this.nojianBtn.visible = false;
        }
    }

    /**设置拥有数量 */
    private setMyCount(num) {
        if (num != "") {
            this.myCount.text = num;
        }
    }

    /**关闭 */
    private close() {
        this.hide();
        this.count = 1;
    }

    //设置道具可用界面
    private setToolCanUse(){
        let initiative = this.recData.initiative;
        if(initiative == true){   //可主动使用，显示+ - 
            this.okBtn.visible = true;
            this.canelBtn.visible = true;
            this.jiaBtn.visible = true;
            this.jianBtn.visible = true;
            this.canelMidBtn.visible = false;
        }else{   //不可主动使用，只展示信息，不显示+ -
            this.okBtn.visible = false;
            this.canelBtn.visible = false;
            this.jiaBtn.visible = false;
            this.jianBtn.visible = false;
            this.canelMidBtn.visible = true;
            this.countLabel.text = this.recData.count + "";
            this.contentLabel.text += "（不能在背包中使用）";
        }
    }

}