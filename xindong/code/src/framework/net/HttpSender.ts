/**
 * http请求类
 * @author leo
 *
 */
class HttpSender {

    /**
     * 发送post登录请求
     */
    public post(url: string, paramObj: Object, cb: Function, obj: any, lock: boolean = true): void {
        let dataObj = this.extendObj(ProtocolHttp.httpHead, paramObj);
        let dataToSend = JSON.stringify(dataObj);
        console.log("post url:" + url + dataToSend);
        var request: egret.HttpRequest = new egret.HttpRequest();
        request.open(ProtocolHttpUrl.url + url, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        if (lock) {
            App.LoadingLock.httpLock(() => {
                Tips.info(LanConst.http0_00);
            });
        }

        request.once(egret.Event.COMPLETE, function (e) {
            console.log("post complete:",lock);
            if (lock) {
                App.LoadingLock.unlock();
            }
            var request = <egret.HttpRequest>e.currentTarget;
            try {
                var re = JSON.parse(request.response);
                console.log(re);
            }
            catch (err) {
                Tips.info(LanConst.http0_01);
                return;
            }
            cb.call(obj, re);
        }, this);

        request.once(egret.IOErrorEvent.IO_ERROR, function (e) {
            if (lock) {
                App.LoadingLock.unlock();
                App.LoadingLock.unLockScreen();
            }
            Tips.info(LanConst.http0_02);
        }, this);
        request.send(dataToSend);
        
    }


	/**
	 * 合并请求头和参数
	 * @param obj1 请求头
	 * @param obj2  参数
	 */
    private extendObj(obj1: Object, obj2: Object) {

        var obj3 = new Object;

        for (let key in obj2) {
            if (obj3.hasOwnProperty(key)) continue;
            obj3[key] = obj2[key];

        }

        for (let key in obj1) {
            if (obj3.hasOwnProperty(key)) continue;
            obj3[key] = obj1[key];
            if (key == "Authorization") obj3[key] = App.DataCenter.skey;
            if (App.DataCenter.skey) { console.log("sky:::", App.DataCenter.skey) }
        }
        return obj3;
    }

}
