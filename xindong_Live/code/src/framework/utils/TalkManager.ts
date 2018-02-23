/**
 * 播放语音管理类
 * @author chenaki 2018/1/3
 */
class TalkManager extends SingleClass {
    private sound = new egret.Sound();    //声音
    private channel: egret.SoundChannel;  //声道

    private complete:Function;     //完成回调
    private error:Function;        //错误回调
    private thisObject:any;        //回调执行对象

    /**
     * 播放语音
     * @param url 声音链接
     * @param complete 播放完成回调，例如电话播放完成，进行下一步
     * @param error    加载错误回调，例如电话，加载错误后，让游戏继续下去
     * @param thisObject 回调执行对象
     */
    public playSound(url:string ,complete:Function = null, error:Function = null, thisObject:any = null) {
        console.log("准备播放语音");
        //添加加载完成侦听
        this.sound.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.sound.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundError, this);

        //回调
        this.complete = complete;
        this.error = error;
        this.thisObject = thisObject;

        //开始加载
        this.sound.load(url);
    }
    //完成监听
    private onLoadComplete(event: egret.Event): void {
        console.log("语音加载完成");
        if (this.channel) {
            this.channel.stop();
            this.channel = null;
        }
        //获取加载到的 Sound 对象
        this.sound = <egret.Sound>event.target;
        //播放音乐
        this.sound.type = egret.Sound.MUSIC;
        this.channel = this.sound.play(0, 1);
        this.channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
    }

    /*播放完成监听 */
    private onSoundComplete(event: egret.Event): void {
        if(this.complete && this.thisObject){
            this.complete.call(this.thisObject);
        }
        this.stopSound();
    }

    /**播放错误监听 */
    private onSoundError(event: egret.Event) {
        Tips.info("声音加载失败，请检查您的网络后重试");
        if(this.error && this.thisObject){
            this.error.call(this.thisObject);
        }
        this.stopSound();
    }

    /**关闭声音 */
    public stopSound() {
        console.log("停止加载语音");
        //删除声道
        if (this.channel) {
            this.channel.stop();
            this.channel = null;
        }

        //删除声音
        this.sound.close();
        this.sound.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundError, this);

        //删除回调
        this.complete = null;
        this.error = null;
        this.thisObject = null;
    }

}
