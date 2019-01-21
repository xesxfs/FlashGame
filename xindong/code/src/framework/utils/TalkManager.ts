/**
 * 播放语音管理类
 * @author xiongjian
 * @date 2017-9-7
 */
class TalkManager extends SingleClass {
    //创建 Sound 对象
    private sound = new egret.Sound();
    private channel: egret.SoundChannel;
    private channelList = [];

    /**播放语音 */
    public soundPlay(url) {

        //添加加载完成侦听
        this.sound.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        //开始加载
        this.sound.load(url);
    }
    //完成监听
    private onLoadComplete(event: egret.Event): void {
        console.log("声音加载完成");
        if (this.channel) {
            this.channel.stop();
            this.channel = null;
        }
        //获取加载到的 Sound 对象
        this.sound = <egret.Sound>event.target;
        //播放音乐
        this.sound.type = egret.Sound.MUSIC;
        this.channel = this.sound.play(0, 1);
        this.channelList.push(this.channel);
        this.channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onSoundComplete, this);
        this.channel.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSoundError, this);
    }

    /*播放完成监听 */
    private onSoundComplete(event: egret.Event): void {
        egret.log("onSoundComplete");
    }

    /**播放错误监听 */
    private onSoundError(event: egret.Event) {
        Tips.info("声音加载失败，请检查您的网络后重试");
        console.log("error");
    }

    /**关闭声音 */
    public stopSound() {
        if (this.channel) {
            this.channel.stop();
            this.channel = null;
        }
    }

}
