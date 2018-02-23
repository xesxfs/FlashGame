/**
 * 声音管理类
 * @author chenkai
 * @date 2016/6/30
 */
class SoundManager extends SingleClass {
    private soundList = {};                    //声音列表
    private bgmChannel: egret.SoundChannel;     //背景音声道
    private effectChannel:egret.SoundChannel    //音效声道

    private _allowPlayEffect: boolean = true;   //是否允许播放音效
    private _allowPlayBGM: boolean = true;      //是否允许播放背景音乐
    private _effectVolume: number = 1;          //音效音量
    private _bgmVolume: number = 0.4;             //背景音量

    /**心动女友 */
    public static bgm: string = "Lovehome_mp3";            //背景音乐
    public static button: string = "return_mp3";       //按钮
    public static click: string = "click_mp3"; //点击
    public static time_click: string = "time_click_mp3";//计时
    public static success: string = "success_mp3";//成功
    public static select: string = "select_mp3";//选择
    public static new_msg: string = "new_msg_mp3";//新消息
    public static calling: string = "calling_mp3";//拨打电话
    public static common_use: string = "common_use_mp3";//确认点击
    public static close: string = "close2_mp3";//关闭音效
    public static working: string = "working_mp3";//工作中
    public static work_done: string = "work_done_mp3";//工作完成
    public static love_done: string = "love_done_mp3";//恋爱完成
    public static dialogue_pop: string = "dialogue_pop_mp3";//弹出框音效
    public static wrong_answer: string = "wrong_answer_mp3";//好感度减少
    public static sent_msg: string = "sent_msg_mp3";//发送微信
    public static levelup: string = "levelup_mp3";//升级音效
    public static page_switch: string = "page_switch_mp3";//商城页面切换音效
    public static number_add: string = "number_add_mp3";//道具加音效
    public static number_reduce: string = "number_reduce_mp3";//道具减音效

    public static library: string = "library_mp3";//图书馆音效
    public static canteen: string = "canteen_mp3";//吃饭音效
    public static shopping: string = "shopping_mp3";//唱歌音效
    public static park: string = "park_mp3";//公园音效
    public static gym: string = "gym_mp3";//健身音效
    public static cat: string = "cat_mp3";//逗猫音效
    public static carnie: string = "carnie_mp3";//游乐园音效

    public constructor() {
        super();
    }


	/**
	 * 播放音效
	 * @param soundName 声音名
	 * @param startTime 播放起始位置
	 * @param loops 循环次数
	 */
    public playEffect(soundName: string, startTime: number = 0, loops: number = 1) {
        if (this.allowPlayEffect == false) {
            return;
        }
        //从声音列表中获取,声音列表中不存在，则从加载资源中获取
        var sound: egret.Sound = this.soundList[soundName];
        if (sound == null) {
            sound = RES.getRes(soundName);
            if (sound != null) {
                this.soundList[soundName] = sound
            } else {
                //TODO 从resource/assets中加载，则使用一个加载一个，而不需要全部加载
            }
        }
        if (sound) {
            sound.type = egret.Sound.EFFECT;
            return sound.play(startTime, loops)
        }
        return null;
    }

    /**
     * 停止音效
     */
    public stopEffect(chanel:egret.SoundChannel) {
        if (chanel) {
            chanel.stop();
            chanel = null;
        }
    }


	/**
	 * 播放背景音乐
	 * @param bgmName 背景音名
	 * @param startTime 播放起始位置
	 * @param loops 循环次数
	 */
    public playBGM(bgmName: string, startTime: number = 0, loops: number = Number.MAX_VALUE) {
        if (this.allowPlayBGM == false || this.bgmChannel != null) {
            return;
        }
        this.stopBGM();
        var bgm: egret.Sound = this.soundList[bgmName];
        if (bgm == null) {
            bgm = RES.getRes(bgmName);
            bgm && (this.soundList[bgmName] = bgm);
        }
        if (bgm) {
            console.log("SoundManager >> play BGM");
            bgm.type = egret.Sound.MUSIC;
            this.bgmChannel = bgm.play(startTime, loops);
            this.bgmChannel.volume = this._bgmVolume;
        }
    }

    /**停止背景音乐*/
    public stopBGM() {
        console.log("SoundManager >> stop BGM");
        if (this.bgmChannel) {
            this.bgmChannel.stop();
            this.bgmChannel = null;
        }
    }

    /**获取是否允许播放音效*/
    public get allowPlayEffect() {
        return this._allowPlayEffect;
    }

    /**设置是否允许播放音效*/
    public set allowPlayEffect(bAllow: boolean) {
        this._allowPlayEffect = bAllow;
    }

    /**获取是否允许播放背景音*/
    public get allowPlayBGM() {
        return this._allowPlayBGM;
    }

    /**设置是否允许播放背景音*/
    public set allowPlayBGM(bAllow: boolean) {
        this._allowPlayBGM = bAllow;
        if (this._allowPlayBGM == false) {
            this.stopBGM();
        } else {
            this.playBGM(SoundManager.bgm);
        }
    }

    /**获取音效音量*/
    public get effectVolume() {
        return this._effectVolume;
    }

    /**设置音效音量*/
    public set effectVolume(value: number) {
        this._effectVolume = value;
    }

    /**获取BGM音量*/
    public get bgmVolume() {
        return this._bgmVolume;
    }

    /**设置BGM音量*/
    public set bgmVolume(value: number) {
        this._bgmVolume = value;
        if (this.bgmChannel) {
            this.bgmChannel.volume = this._bgmVolume;
        }
    }

    /**窗口失去焦点时 关闭背景音乐 */
    public windowFocusHandler(){
        if(App.DeviceUtils.IsWeb){
            App.StageUtils.stage.addEventListener(egret.Event.ACTIVATE, ()=>{
                if(App.DataCenter.isVideoPlaying == false){
                    App.SoundManager.playBGM(SoundManager.bgm);
                }
            },this);

            App.StageUtils.stage.addEventListener(egret.Event.DEACTIVATE, ()=>{
                App.SoundManager.stopBGM();
            },this)
        }
    }
    

}
