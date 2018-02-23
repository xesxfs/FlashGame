/**
 * 设备工具类
 * @author chenkai
 * @2016/10/11
 */
class DeviceUtils extends SingleClass{
	
	/**runtimeType 运行在web上*/
	public get IsWeb(){
		return (egret.Capabilities.runtimeType == egret.RuntimeType.WEB);
	}

	/**runtimeType 运行在native上*/
	public get IsNative(){
		return (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE);
	}
	
	/**是否移动端 */
	public get isMobile(){
		return egret.Capabilities.isMobile;
	}
	
	/**是否ios系统 */
	public get IsIos(){
	    return (egret.Capabilities.os=="iOS")
	}
	/**是否android系统 */
	public get IsAndroid(){
        return (egret.Capabilities.os == "Android")
	}
}