import { useEffect } from 'react';

interface Info {
  title: string;
  id: string;
  pageName: string;
}

/**
 * 修改document title
 * @param option 配置
 * @param defaultTitle 应用默认标题
 */
const useDocumentTitle = (option: Info, defaultTitle: string) => {
  const titleText =
    typeof option.pageName === 'string' ? option.title : defaultTitle;
  useEffect(() => {
    if (titleText) {
      document.title = titleText;
    }
  }, [option.title]);
};

export default useDocumentTitle;
