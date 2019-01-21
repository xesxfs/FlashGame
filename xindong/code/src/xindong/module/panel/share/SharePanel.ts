/**
 * 分享面板
 */
class SharePanel extends BasePanel{
	private weiboBtn:eui.Image;   
	private qqBtn:eui.Image;
	private zoneBtn:eui.Image;
	private weixinBtn:eui.Image;
	private friendBtn:eui.Image;
	private closeBtn:eui.Image;
	private okBtn:eui.Button;
	
	public constructor() {
		super();
		this.skinName = "SharePanelSkin";
	}

	public onEnable(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	public onRemove(){
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	private onTouchTap(e:egret.TouchEvent){
		switch(e.target){
			case this.weiboBtn:    //微博
			break;  
			case this.qqBtn:       //QQ
			break;  
			case this.zoneBtn:     //QQ空间
			break;
			case this.weixinBtn:   //微信
			break;
			case this.friendBtn:   //朋友圈
			break;
			case this.closeBtn:    //关闭
				this.hide();
			break;
			case this.okBtn:      //确认
				this.onShare();
			break;
		}
	}

	private onShare(){
		this.hide();
		
		//7k7k分享
		var auth_7k7k = window["auth_7k7k"];
		if(auth_7k7k){
			let K7_SDK = window["K7_SDK"];
			K7_SDK.wxShare({
					title: '心动女生',
					desc: '与女神来一场轰轰烈烈的爱情吧！',
					custom:'{user:"yafet"}',
					imgUrl: 'http://www.dmgame.com:3000/xdns.png',
					isUseGuide: 'yes'
				});
		}
        
	}
}