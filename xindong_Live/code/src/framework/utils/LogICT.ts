/**
 * log拦截器
 * @author xiongjian 
 * @date 2017-9-19
 */
class LogICT extends SingleClass implements Console {
    public isDebug:boolean;
    public oldLog: Console;

    public constructor() {
        super();
        
        this.isDebug = StaticCfg.isDebug;
        if (this.isDebug) {

        } else {
            this.oldLog = console;
            console = this;
        }

    }


    public assert(test?: boolean, message?: string, ...optionalParams: any[]): void { };
    public clear(): void { };
    public count(countTitle?: string): void { };
    public debug(message?: string, ...optionalParams: any[]): void { };
    public dir(value?: any, ...optionalParams: any[]): void { };
    public dirxml(value: any): void { };
    public error(message?: any, ...optionalParams: any[]): void { };
    public exception(message?: string, ...optionalParams: any[]): void { };
    public group(groupTitle?: string): void { };
    public groupCollapsed(groupTitle?: string): void { };
    public groupEnd(): void { };
    public info(message?: any, ...optionalParams: any[]): void { };
    public log(message?: any, ...optionalParams: any[]): void {
        if (this.isDebug && App.DeviceUtils.IsNative) {
            let data = "";
            for (let key in optionalParams) {
                data = data + optionalParams[key];
            }
            this.oldLog.log("" + message + data);
        }

    };
    public msIsIndependentlyComposed(element: Element): boolean { return false };
    public profile(reportName?: string): void { };
    public profileEnd(): void { };
    public select(element: Element): void { };
    public table(...data: any[]): void { };
    public time(timerName?: string): void { };
    public timeEnd(timerName?: string): void { };
    public trace(message?: any, ...optionalParams: any[]): void { };
    public warn(message?: any, ...optionalParams: any[]): void { };
}