/**
 * 互动答题
 * @author sven
 * 2017.12.27
 */
class InteractAnsPanel extends BasePanel {
    public topMenu:TopMenu;
    private captionLab:eui.Label;
    private questionLab:eui.Label;
    private timeLab:eui.Label;
    private ansAGro:eui.Group;
    private ansLabA:eui.Label;
    private tipImgA:eui.Image;
    private grayRectA:eui.Image;
    private ansBGro:eui.Group;
    private ansLabB:eui.Label;
    private tipImgB:eui.Image;
    private grayRectB:eui.Image;
    private ansCGro:eui.Group;
    private ansLabC:eui.Label;
    private tipImgC:eui.Image;
    private grayRectC:eui.Image;
    private ansDGro:eui.Group;
    private ansLabD:eui.Label;
    private tipImgD:eui.Image;
    private grayRectD:eui.Image;
    private cutGro:eui.Group;
    private costImg:eui.Image;
    private costLab:eui.Label;
    private cutGray:eui.Image;

    private ansGroList: Array<eui.Group>=[];
    private ansImgList: Array<eui.Image>=[];
    private ansLabList: Array<eui.Label>=[];
    private ansTipList: Array<eui.Image>=[];
    private ansGrayList: Array<eui.Image>=[];
    private curentQuestion: InteractQuesVo;

    private ansTimer: DateTimer;
    private curTime: number;
    private totalTime: number = 30;
    private chooseIndex: number = 0;
    private totalTrue: number = 0;
    private totalScore: number = 0;

    public constructor() {
        super();
        this.skinName = "InteractAnsPanelSkin";
    }

    protected childrenCreated() {
    }

    public onEnable() {
        this.topMenu.showConfig(false, false, TopMenuTitle.InteractAns);
        this.topMenu.setCloseCallback(this.closeCallback, this);
        this.reTopUI();

        this.initUIList();

        for (let i = 0;i < this.ansGroList.length;i ++) {
            CommomBtn.btnClick(this.ansGroList[i], this.onClickAns, this, ComBtnType.Click);
        }
        CommomBtn.btnClick(this.cutGro, this.onClickCut, this, ComBtnType.Click);

        this.showCurrentQuestion();
    }

    public onRemove() {
        for (let i = 0;i < this.ansGroList.length;i ++) {
            CommomBtn.removeClick(this.ansGroList[i], this.onClickAns, this);
        }
        CommomBtn.removeClick(this.cutGro, this.onClickCut, this);
        this.chooseIndex = 0;
        this.totalTrue = 0;
        this.totalScore = 0;
        this.stopTimer();
    }

    /**显示当前题目 */
    private showCurrentQuestion() {
        this.curentQuestion = App.DataCenter.interactAnsInfo.questionList[App.DataCenter.interactAnsInfo.questionNum];
        if (!this.curentQuestion) {
            console.warn("question list warn");
            return;
        }

        this.captionLab.text = "题目" + (App.DataCenter.interactAnsInfo.questionNum+1) + "：";
        this.questionLab.text = this.curentQuestion.question;
        for (let i = 0;i < this.curentQuestion.answers.length;i ++) {
            if (this.curentQuestion.answers[0].cut_cons != 0) {
                this.costLab.text = this.curentQuestion.answers[0].cut_cons + "";
                break;
            }
        }
        for (let i = 0;i < this.ansGroList.length;i ++) {
            this.ansLabList[i].text = this.curentQuestion.answers[i].answer;
        }

        this.initBtnStatus();
        this.startTimer();
    }

    /**选择答案 */
    private onClickAns(e: egret.TouchEvent) {
        for (let i = 0;i < this.curentQuestion.answers.length;i ++) {
            this.ansGroList[i].touchChildren = false;
            this.ansGroList[i].touchEnabled = false;
        }
        this.cutGro.touchEnabled = false;
        this.cutGro.touchChildren = false;

        let http:HttpSender = new HttpSender;
        let data = ProtocolHttp.answerQuestion;
        data.qid = this.curentQuestion.id;
        this.chooseIndex = -2;
        for (let i = 0;i < this.ansImgList.length;i ++) {
            if (e.target == this.ansImgList[i] || e.target == this.ansGroList[i]) {
                this.chooseIndex = i;
                break;
            }
        }
        if (this.chooseIndex == -2) {
            return;
        }
        data.aid = this.curentQuestion.answers[this.chooseIndex].id;
        http.post(ProtocolHttpUrl.questionAnswer, data, this.revAnswer, this);
    }

    /**超时发送答案 */
    private overTime() {
        let http:HttpSender = new HttpSender;
        let data = ProtocolHttp.answerQuestion;
        data.qid = this.curentQuestion.id;
        data.aid = -1;
        this.chooseIndex = -1;
        http.post(ProtocolHttpUrl.questionAnswer, data, this.revAnswer, this);
    }

    private revAnswer(data) {
        if(data.code == 200){
            this.stopTimer();
            App.DataCenter.reUserBase(data.data);
            App.DataCenter.interactAnsInfo.questionNum ++;
            if (this.chooseIndex < 0) {
                // 超时特殊处理  todo
            }
            else {
                if (this.curentQuestion.answers[this.chooseIndex].score > 0) {
                    this.ansTipList[this.chooseIndex].source = "interact_right_png";
                    App.SoundManager.playEffect("ans_right_mp3");
                    this.totalTrue ++;
                    this.totalScore += this.curentQuestion.answers[this.chooseIndex].score;
                }
                else {
                    App.SoundManager.playEffect("ans_wrong_mp3");
                    this.ansTipList[this.chooseIndex].source = "interact_error_png";
                }
                this.ansTipList[this.chooseIndex].visible = true;
            }

            setTimeout(()=>{
                if (App.DataCenter.interactAnsInfo.questionNum < App.DataCenter.interactAnsInfo.questionList.length) {
                    this.showCurrentQuestion();
                }
                else {
                    // 本次答题全部结束
                    this.reqResult();
                }
                this.initBtnStatus();
            },1000);
            
		}else{
			Tips.info(data.info);
            this.initBtnStatus();
		}
    }

    /**请求结算 */
    private reqResult() {
        let http:HttpSender = new HttpSender;
        http.post(ProtocolHttpUrl.questionResult, {}, this.revResult, this);
    }

    private revResult(data) {
        this.reqResultVideo(data.data.ossvid);

        setTimeout(()=>{
            let sureDialog:SureDialog = new SureDialog();
            sureDialog.setInteractAnsReward(data.data.right, data.data.score, ()=>{
                Utils.heartFlutter(data.data.score);
                this.sureOver();
            }, this);
            sureDialog.show();
        }, 1000);
    }

    /**结算视频 */
    private reqResultVideo(name: string) {
        let http = new HttpSender();
        let param = { vname: name};
        http.post(ProtocolHttpUrl.videoUrl, param, this.revResultVedio, this);
    }

    private revResultVedio(data) {
        if (data.code == 200) {
            let videoType:VideoType;
            videoType = VideoType.fav;
            App.NativeBridge.sendPlayVideo(videoType, data.data.url);
        } else {
            Tips.info(data.info);
        }
    }

    /**获取奖励面板确定回调 */
    private sureOver() {
        this.hide();
        this.reqInteractAnsCost();
    }

    /**去除两选项点击 */
    private onClickCut() {
        let http:HttpSender = new HttpSender;
        let data = ProtocolHttp.cutAnswer;
        data.qid = this.curentQuestion.id;
        data.aid = -1;
        http.post(ProtocolHttpUrl.questionCut, data, this.revCut, this);
    }

    private revCut(data) {
        if(data.code == 200) {
            App.DataCenter.reUserBase(data.data);
            this.reTopUI();
            this.cutGro.touchEnabled = false;
            this.cutGro.touchChildren = false;
            this.cutGray.visible = true;
            for (let i = 0;i < this.curentQuestion.answers.length;i ++) {
                if (this.curentQuestion.answers[i].cut == 1) {
                    this.ansGroList[i].touchEnabled = false;
                    this.ansGroList[i].touchChildren = false;
                    this.ansGrayList[i].visible = true;
                }
            }
        }
        else {
            Tips.info(data.info);
        }
    } 

    /**重置按钮状态 */
    private initBtnStatus() {
        for (let i = 0;i < this.ansGroList.length;i ++) {
            this.ansGroList[i].touchChildren = true;
            this.ansImgList[i].touchEnabled = true;

            this.ansTipList[i].visible = false;
            this.ansGrayList[i].visible = false;
        }

        this.cutGro.touchEnabled = true;
        this.cutGro.touchChildren = true;
        this.cutGray.visible = false;
    }

    /**开始计时 */
    private startTimer(limitTime: number = this.totalTime) {
        this.curTime = limitTime;
        this.timeLab.textColor = 0x000000;
        this.timeLab.alpha = 1;
        this.timeLab.text = "剩余时间 0:" + NumberTool.formatTime(this.curTime);

        this.ansTimer && this.ansTimer.stop() && (this.ansTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this));
        this.ansTimer = new DateTimer(1000, this.curTime);
        this.ansTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.ansTimer.reset();
        this.ansTimer.start();
    }

    /**停止倒计时 */
    private stopTimer() {
        this.ansTimer && this.ansTimer.stop();
        egret.Tween.removeTweens(this.timeLab);
        this.ansTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
    }

    /**时间脉冲 */
    private onTimer() {
        if (Number(this.curTime) <= 1) {
            this.timeLab.text = "剩余时间 0:" + "00";
            this.stopTimer();
            this.overTime();
            return;
        }
        this.curTime--;
        if (this.curTime == 5) {
            this.timeLab.textColor = 0xFF0033;
            this.timeBlink();
        }
        if (this.curTime <= 3) {
            App.SoundManager.playEffect("time_up_mp3");
        }
        this.timeLab.text = "剩余时间 0:" + NumberTool.formatTime(this.curTime);
    }

    private timeBlink() {
        egret.Tween.get(this.timeLab, {loop: true})
        .to({alpha: 0.5}, 500)
        .to({alpha: 0}, 100)
        .to({alpha: 1}, 100)
        .wait(300)
    }

    /**关闭回调 */
    private closeCallback() {
        this.reqInteractAnsCost();
    }

    /**刷新顶部UI */
    public reTopUI() {
        this.topMenu.setAssetUI();
    }

    private initUIList() {
        if (this.ansGroList.length > 0) {
            return;
        }

        this.ansGroList.push(this.ansAGro);
        this.ansGroList.push(this.ansBGro);
        this.ansGroList.push(this.ansCGro);
        this.ansGroList.push(this.ansDGro);

        for (let i = 0;i < this.ansGroList.length;i ++) {
            this.ansImgList.push(<eui.Image>this.ansGroList[i].getChildAt(0));
        }

        this.ansLabList.push(this.ansLabA);
        this.ansLabList.push(this.ansLabB);
        this.ansLabList.push(this.ansLabC);
        this.ansLabList.push(this.ansLabD);

        this.ansTipList.push(this.tipImgA);
        this.ansTipList.push(this.tipImgB);
        this.ansTipList.push(this.tipImgC);
        this.ansTipList.push(this.tipImgD);

        this.ansGrayList.push(this.grayRectA);
        this.ansGrayList.push(this.grayRectB);
        this.ansGrayList.push(this.grayRectC);
        this.ansGrayList.push(this.grayRectD);
    }

    /**答题消耗信息 */
    public reqInteractAnsCost() {
        let http:HttpSender = new HttpSender();
        http.post(ProtocolHttpUrl.questionAnsMain, {}, this.revAnsCost, this);
    }

    /**接收答题消耗 */
    private revAnsCost(data) {
        if(data.code == 200){
            App.DataCenter.interactAnsInfo.cost = data.data;
			App.PanelManager.open(PanelConst.InteractPanel);
		}else{
			Tips.info(data.info);
		}
    }
}