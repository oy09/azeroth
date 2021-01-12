import React from 'react';
import GridContent from '@/layouts/GridContent';
import { sliceTextToArray, sliceTextIndex } from '@/utils/stringUtils';
import './Home.scss';

export interface HomePageProps {
  //
}

const HomePage: React.FC<HomePageProps> = props => {
  return <GridContent>Home page</GridContent>;
};

const content =
  '保险条款中包含免除保险人责任的条款，根据《保险法》第十七条，我现在向您阅读保险合同中免除保险人责任的条款，工银安盛人寿附加养老年金保险责任免除条款,因下列情形之一，导致被保险人身故的，我们不承担给付身故保险金的责任：一、您对被保险人的故意杀害、故意伤害；二、被保险人故意犯罪或者抗拒依法采取的刑事强制措施； 三、被保险人自本附加合同成立或者合同效力恢复之日起2年内自杀，但被保险人自杀时为无民事行为能力人的除外。发生上述第一项情形导致被保险人身故的，本附加合同效力终止，我们将向被保险人的继承人退还本附加合同的现金价值。发生上述其他情形导致被保险人身故的，本附加合同效力终止，我们将向您退还本附加合同的现金价值。请您特别关注：除以上内容外，我司已在保险条款中对于免除我司保险责任的内容进行充分提示，请您务必仔细阅读，确认您已充分知悉责任免除的情形。 ';

console.log('slice array:', sliceTextToArray(content));

export default HomePage;
