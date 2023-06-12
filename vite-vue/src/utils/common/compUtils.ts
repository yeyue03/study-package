const baseApiUrl = '/aaa';

/**
 *  获取文件服务访问路径
 * @param fileUrl 文件路径
 * @param prefix(默认http)  文件路径前缀 http/https
 */
 export const getFileAccessHttpUrl = (fileUrl: string, prefix = 'http') => {
  let result = fileUrl;
  try {
    if (fileUrl && fileUrl.length > 0 && !fileUrl.startsWith(prefix)) {
      //判断是否是数组格式
      const isArray = fileUrl.indexOf('[') != -1;
      if (!isArray) {
        const prefix = `${baseApiUrl}/sys/common/static/`;
        // 判断是否已包含前缀
        if (!fileUrl.startsWith(prefix)) {
          result = `${prefix}${fileUrl}`;
        }
      }
    }
  } catch (err) {}

  let _str = '';
  if (result) {
    _str = 'https://img2.baidu.com/it/u=2067773741,1621881016&fm=253&fmt=auto&app=138&f=JPEG?w=551&h=500'
  }

  return _str;
};