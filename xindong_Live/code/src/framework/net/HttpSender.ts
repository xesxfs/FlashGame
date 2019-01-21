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
        console.log("post url:" + url + " " + dataToSend);
        var request: egret.HttpRequest = new egret.HttpRequest();
        request.open(ProtocolHttpUrl.url + url, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        //http请求遮罩
        if (lock) {
            App.LoadingLock.httpLock(() => {
                Tips.info("请求超时，请稍候再试");
            });
        }

        //请求完成
        request.once(egret.Event.COMPLETE, (e)=>{
            if (lock) {
                App.LoadingLock.unlock();
            }
            var request = <egret.HttpRequest>e.currentTarget;
            try {
                var re = JSON.parse(request.response);
                console.log("HttpSender >> 返回数据:" ,re);
            }
            catch (err) {
                Tips.info("返回数据错误");
                return;
            }
            this.specialCode(re.code) && cb.call(obj, re);
        }, this);

        //请求错误
        request.once(egret.IOErrorEvent.IO_ERROR, (e)=>{
            if (lock) {
                App.LoadingLock.unLockScreen();
                App.LoadingLock.unlock();
            }
            //Tips.info("网络无法连接，请检查您的网络后重试");
            console.log("HttpSender >> http请求错误");
            App.EventManager.sendEvent(EventConst.HTTP_ERROR, url,paramObj, cb,obj);
        }, this);

        request.send(dataToSend);
    }

    /**
     * 特殊错误码拦截处理
     */
    private specialCode(code: number):boolean {
        if (code == 401) {
            // 未登录，即skey过期处理
            let dialog:SureDialog = new SureDialog();
            dialog.setContent("登录异常，请重新登录");
            dialog.setOk(()=>{
                App.EventManager.sendEvent(EventConst.LOGIN_OUT);
            }, this);
            dialog.show();

            return false;
        }
        else if (code == 816) {
            // 金币不足
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setLackCurrency(1);
            dialog.show();
            this.closeSmallPanel();
            return false;
        }
        else if (code == 855) {
            // 钻石不足
            let dialog:ConfirmDialog = new ConfirmDialog();
            dialog.setLackCurrency(2);
            dialog.show();
            this.closeSmallPanel();
            return false;
        }
        else {
            return true;
        }
    }

    /**关闭小弹窗 */
    private closeSmallPanel() {
        // 需要关闭的小弹窗列表
        let smallList = [PanelConst.BuyToolPanel];
        for (let i = 0;i < smallList.length;i ++) {
            let panel = App.PanelManager.getPanel(smallList[i]);
            if (panel && panel.parent) {
                App.PanelManager.close(smallList[i]);
            }
        }
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
            if (App.DataCenter.skey) {}
        }
        return obj3;
    }

}
