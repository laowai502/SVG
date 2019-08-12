const ResultCode = {
    SUCCESS: 200,   	//成功
    PARAMS_ERROR: 400,  //参数异常，验证失败
	AUTH_ERROR: 401,    //未授权
	FORBIDDEN: 403,		//服务器拒绝请求
    NO_FOUND: 404,      //路径错误，资源未找到
    NOT_ALLOWED: 405,	//请求方式错误
    SEVER_ERROR: 500,   //服务器异常
    GATEWAY: 502,		//网关异常
    LOGIN_FAIL: 509		//用户登录异常
};

export default ResultCode;