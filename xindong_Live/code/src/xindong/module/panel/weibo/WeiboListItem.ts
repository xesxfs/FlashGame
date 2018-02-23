/**
 * @author xiongjian 
 * @date 2017/9/20
 * 微博列表item
 */
class WeiboListItem extends eui.ItemRenderer {

    public headGroup: eui.Group;
    public headImg: eui.Image;
    public girlName: eui.Label;
    public contentLabel: eui.Label;
    public contentImg: eui.Image;
    public dateLabel: eui.Label;
    public zanlabel: eui.Label;
    public huifuGroup: eui.Group;
    public phoneText: eui.Label;

    public proveGroup: eui.Group;
    public zanImg: eui.Image;
    public pinlunImg: eui.Image;

    private touchType: number = 0;
    private isTouch: boolean = false;

    private boyTalk = [];
    private girlTalk = [];
    private pos;//回复显示位置
    private huifu = [];
    private sendTalk;

    private oldData;

    private contentImgWidth:number = 350;   //微博图片显示时高宽，原图为了放大查看更清晰，尺寸较大。
    private contentImgHeight:number = 240;

    /**选择回答列表 */
    public selectList:MessageList;
    /**选择背景 */
    public selectBg:eui.Rect;
    /**选择回答容器 */
    public selectGroup:eui.Group;

    public constructor() {
        super();
        this.skinName = "WeiboListItemSkin";
        this.pinlunImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pinlunTouch, this);
        this.zanImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.zanTouch, this);
    }

    public childrenCreated(){
        //获取微博的选择UI
        let weiboPanel:WeiboPanel = App.PanelManager.getPanel(PanelConst.WeiboPanel);
        this.selectList = weiboPanel.selectList;
        this.selectGroup = weiboPanel.selectGroup;
        this.selectBg = weiboPanel.selectBg;
    }

    protected dataChanged() {

        if (this.oldData == this.data) {
            return;
        }
        console.log("data", this.data);
        this.phoneText.text = this.data.phone;
        this.contentLabel.text = this.data.content.content;
        this.contentImg.source = this.data.content.pic;
        this.setDate(this.data.days);
        if(this.data.content.pic != ""){
            this.contentImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onContentImgTouch, this);
            this.contentImg.width = this.contentImgWidth;
            this.contentImg.height = this.contentImgHeight;
        }
        let approve = this.data.content.approve
        let text = "";
        for (let i = 0; i < approve.length; i++) {
            text = text + approve[i] + "  "
        }
        this.zanlabel.text = text;
        this.girlName.text = App.DataCenter.ConfigInfo.girl_name;
        this.headImg.source = App.DataCenter.Weibo.weibo_head;

        //按钮相关
        let is_approve = this.data.is_approve
        let is_reply = this.data.is_reply
        if (is_approve == "1" && is_reply == "1") {
            this.zanImg.visible = false;
            this.pinlunImg.visible = false;
        } else {

            if (is_approve == "0" && is_reply == "0") {
                this.zanImg.visible = true;
                this.pinlunImg.visible = true;
            }
            if (is_approve == "0" && is_reply == "1") {
                this.zanImg.visible = true;
                this.pinlunImg.visible = false;
            }
            if (is_approve == "1" && is_reply == "0") {
                this.zanImg.visible = false;
                this.pinlunImg.visible = true;
            }
        }

        //回复
        this.huifuGroup.removeChildren();
        let comment = this.data.content.comment
        let pos = this.data.pos
        this.pos = pos;

        for (let k = 0; k < pos; k++) {
            let str: string = comment[k];
            let label = new eui.Label();
            let match1 = str.match(/(\S*)@(\S*)@(\S*)#(\S*)#/);
            let match2 = str.match(/(\S*)#(\S*)#/);

            let text = <Array<egret.ITextElement>>[];
            if (match1) {
                for (let i = 1; i < match1.length; i++) {
                    let s = match1[i];
                    if (s == "_girl") { s = App.DataCenter.ConfigInfo.girl_name }
                    if (s == "_boy:") { s = App.DataCenter.UserInfo.nickName + ":" }
                    if (s == "_boy") { s = App.DataCenter.UserInfo.nickName }
                    let color = 0x55A4DD
                    if (i % 2 == 0) { color = 0x4D4D4D } else { color = 0x55A4DD }
                    text.push({ text: s, style: { "size": 24, "textColor": color, "fontFamily": "fzyc" } }, )
                }
            } else {
                for (let i = 1; i < match2.length; i++) {
                    let s = match2[i];
                    if (s == "_girl") { s = App.DataCenter.ConfigInfo.girl_name }
                    if (s == "_boy:") { s = App.DataCenter.UserInfo.nickName + ":" }
                    if (s == "_boy") { s = App.DataCenter.UserInfo.nickName }
                    let color = 0x55A4DD
                    if (i % 2 == 0) { color = 0x4D4D4D } else { color = 0x55A4DD }
                    text.push({ text: s, style: { "size": 24, "textColor": color, "fontFamily": "fzyc" } }, )
                }
            }


            label.textFlow = text;
            label.y = k * 35;
            this.huifuGroup.addChild(label);

        }

        /**回复对话 */
        let talk = this.data.talks;
        console.log(talk)
        this.boyTalk = [];
        for (let i = 0; i < talk.length; i++) {
            if (talk[i].role == "1") {
                this.boyTalk.push(talk[i]);

            }
            if (talk[i].role == "0") {
                this.girlTalk.push(talk[i]);
            }
        }

        this.oldData = this.data;

        
    }

    /**
     * 评论
     */
    private pinlunTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        console.log(this.boyTalk)
        if (this.boyTalk.length == 2) {
            let talk = this.boySay(this.boyTalk);
            let weiboPanel:WeiboPanel = App.PanelManager.getPanel(PanelConst.WeiboPanel);
            weiboPanel.showSelect(talk, this.selectHandler, this);
        }
        if (this.boyTalk.length == 3) {
            let talk = this.boySay(this.boyTalk);
            let weiboPanel:WeiboPanel = App.PanelManager.getPanel(PanelConst.WeiboPanel);
            weiboPanel.showSelect(talk ,this.selectHandler, this);
        }
    }

    /**msglist 点击返回 */
    private selectHandler(select: MessageSelectEnum) {
        let weiboPanel:WeiboPanel = App.PanelManager.getPanel(PanelConst.WeiboPanel);
        weiboPanel.hideSelect();
        this.sendTalk = this.boyTalk[select];
        this.sendPinlun();
    }


    /**赞 */
    private zanTouch() {
        App.SoundManager.playEffect(SoundManager.button);
        let http = new HttpSender();
        let param = { id: 0 }
        param.id = this.data.id;
        http.post(ProtocolHttpUrl.weiboApprove, param, this.zanBack, this);
    }
    /**赞返回 */
    private zanBack(data) {
        console.log(data);
        if (data.code == 200) {
            let heart = data.data.hearts;
            TipsHeat.showHeat(heart);
            let userheart = App.DataCenter.UserInfo.hearts
            App.DataCenter.UserInfo.hearts = userheart + heart;
            this.tianjiazan("" + App.DataCenter.UserInfo.nickName);
            this.zanImg.visible = false;
            let panel = <WeiboPanel>App.PanelManager.getPanel(PanelConst.WeiboPanel);
            panel.setHeart(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
        } else {
            Tips.info("" + data.info);
        }
    }

    /**添加赞 */
    private tianjiazan(text) {
        let t = "," + text;
        this.zanlabel.appendText(t);
        let weibo = App.DataCenter.Weibo;
        /**将这两句话push进微博 */
        for (let i = 0; i < weibo.data.length; i++) {
            if (weibo.data[i].id == this.data.id) {
                weibo.data[i].is_approve = "1";
                weibo.data[i].content.approve.push("" + App.DataCenter.UserInfo.nickName);
            }
        }
        App.DataCenter.Weibo = weibo;
    }

    /**添加评论 */
    private tianjiaPinlun(say) {
        let label = new eui.Label();
        let match1 = say.match(/(\S*)@(\S*)@(\S*)#(\S*)#/);
        let match2 = say.match(/(\S*)#(\S*)#/);

        let text = <Array<egret.ITextElement>>[];
        if (match1) {
            for (let i = 1; i < match1.length; i++) {
                let s = match1[i];
                if (s == "_girl") { s = App.DataCenter.ConfigInfo.girl_name }
                if (s == "_boy:") { s = App.DataCenter.UserInfo.nickName + ":" }
                let color = 0x55A4DD
                if (i % 2 == 0) { color = 0x4D4D4D } else { color = 0x55A4DD }
                text.push({ text: s, style: { "size": 24, "textColor": color, "fontFamily": "fzyc" } }, )
            }
        } else {
            for (let i = 1; i < match2.length; i++) {
                let s = match2[i];
                if (s == "_girl") { s = App.DataCenter.ConfigInfo.girl_name }
                if (s == "_boy:") { s = App.DataCenter.UserInfo.nickName + ":" }
                let color = 0x55A4DD
                if (i % 2 == 0) { color = 0x4D4D4D } else { color = 0x55A4DD }
                text.push({ text: s, style: { "size": 24, "textColor": color, "fontFamily": "fzyc" } }, )
            }
        }


        label.textFlow = text;
        label.y = this.pos * 35;
        this.huifuGroup.addChild(label);
        let girlhuifu;
        for (let i = 0; i < this.girlTalk.length; i++) {
            console.log("girl", this.girlTalk[i], "send", this.sendTalk);
            if (this.sendTalk.reply == this.girlTalk[i].pid) {
                girlhuifu = this.girlTalk[i];
            }
        }

        let weibo = App.DataCenter.Weibo;
        /**将这两句话push进微博 */
        for (let i = 0; i < weibo.data.length; i++) {

            if (weibo.data[i].id == this.data.id) {
                weibo.data[i].content.comment.splice(this.pos - 1, 0, say);
                if (girlhuifu) {
                    weibo.data[i].content.comment.splice(this.pos, 0, girlhuifu.says);
                    console.log("girlhuifu", girlhuifu);
                    //将评论长度变长
                    weibo.data[i].pos = weibo.data[i].content.comment.length;

                }
                console.log("data", weibo.data);
                weibo.data[i].is_reply = "1";
            }

        }
        console.log("weibo", weibo);
        App.DataCenter.Weibo = weibo;
    }

    /**发送评论 */
    public sendPinlun() {
        let http = new HttpSender();
        let param = { id: 0, pid: 0, sid: 0 }
        param.id = this.data.id;
        param.pid = this.sendTalk.pid;
        param.sid = this.sendTalk.sid;
        console.log(param);
        http.post(ProtocolHttpUrl.weiboComment, param, this.pinlunBack, this);
    }

    //评论返回
    private pinlunBack(data) {
        console.log(data);
        if (data.code == 200) {
            let heart = data.data.hearts;
            TipsHeat.showHeat(heart);
            let userheart = App.DataCenter.UserInfo.hearts
            App.DataCenter.UserInfo.hearts = userheart + heart;
            this.tianjiaPinlun(this.sendTalk.says);
            this.pinlunImg.visible = false;
            let panel = <WeiboPanel>App.PanelManager.getPanel(PanelConst.WeiboPanel);
            panel.setHeart(App.DataCenter.UserInfo.hearts, App.DataCenter.ConfigInfo.hearts);
        } else {
            Tips.info("" + data.info);
        }
    }

    /**处理评论字符串 */
    private boySay(data) {
        let talk = [];

        for (let i = 0; i < data.length; i++) {
            let match2 = data[i].says.match(/(\S*)#(\S*)#/);

            for (let k = 2; k < match2.length; k++) {
                let t = match2[k];
                let obj = new Object();
                obj["says"] = t
                talk.push(obj);
            }
        }

        return talk;
    }

    //点击微博图片，放大查看
    private onContentImgTouch(){
        //黑色遮罩
        let rect:eui.Rect = new eui.Rect(App.StageUtils.stageWidth, App.StageUtils.stageHeight, 0x000000);
        rect.alpha = 0.8;
        App.LayerManager.topLayer.addChild(rect);

        //查看图片
        let img:eui.Image = new eui.Image(this.contentImg.source);
        let stageP:egret.Point = this.contentImg.parent.localToGlobal(this.contentImg.x, this.contentImg.y); 
        img.x = stageP.x;
        img.y = stageP.y;
        img.width = this.contentImgWidth;
        img.height = this.contentImgHeight;
        App.LayerManager.topLayer.addChild(img);

        //延迟处理，否则获取不了img高宽
        egret.Tween.get(this).wait(50).call(()=>{
            let rate = img.width/img.height;
            let imgX = (App.StageUtils.stageWidth - App.StageUtils.stageHeight*rate)/2;
            let imgY = 0;
            let imgWidth = App.StageUtils.stageHeight*rate;
            let imgHeight = App.StageUtils.stageHeight;
            egret.Tween.get(img).to({x:imgX,y:imgY, width:imgWidth , height:imgHeight},300);

            App.StageUtils.stage.once(egret.TouchEvent.TOUCH_TAP, ()=>{
                rect.parent && rect.parent.removeChild(rect);
                rect = null;
                img.parent && img.parent.removeChild(img);
                img = null;
            }, this);
        },this);
        
    }

    /**设置天数 */
    private setDate(date){
        let weiboData = (App.DataCenter.UserInfo.days - date);
        if(weiboData == 0){
            this.dateLabel.text = "今天"
        }else{
             this.dateLabel.text =  weiboData + "天前";
        }
       
    }

    

}