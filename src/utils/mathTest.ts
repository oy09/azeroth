const list = [
  { id: 1, name: 'a', birth: 896630400000 },
  { id: 2, name: 'b', birth: 725817600000 },
  { id: 3, name: 'c', birth: 725817600001 },
  { id: 3, name: 'd', birth: 725817600002 },
  { id: 3, name: 'e', birth: 725817600003 },
];

// q1 字母排序
console.log(
  'sort:',
  [].concat(list as any).sort((a: any, b: any) => b.name.localeCompare(a.name)),
);

const cleanRepeat = (values: any[]) => {
  const map: any = {};
  values.forEach((item: any) => {
    map[item.id] = item;
  });
  return Object.keys(map).map(key => map[key]);
};

// q2 - 以id过滤重复
console.log('celanRepeat:', cleanRepeat(list));

const filterTo95List = (values: { birth: number }[]) => {
  return values.filter(item => item.birth >= new Date(1995, 0, 1).valueOf());
};

// q3 - 过滤
console.log('filter 95:', filterTo95List(list as any));

const dataSource = new Array(100).fill({ id: 0 }).map((item, index) => ({ id: index }));
const page = 3;
const pageSize = 20;
const limit = (page - 1) * pageSize;
const offset = limit + pageSize;

// q4 - 分页
console.log('pagination:', dataSource.slice(limit, offset));
const solution = (values: number[] = []) => {
  const set1 = new Set();
  values.forEach(a => {
    if (a > 0) {
      set1.add(a);
    }
  });
  for (let i = 1; i <= values.length + 1; i++) {
    if (set1.has(i) === false) {
      return i;
    }
  }
};

const reuslt = solution([1, 2, 3]);
console.log('result:', reuslt);

// 从前往后插，排个序
// 或者，正数从前往后找第一个比他小的
const solution2 = (value: number): string => {
  const insertNum = 5;
  const numberStr: string[] = (value + '').split('');
  if (numberStr[0] === '0') {
    numberStr.splice(1, 0, insertNum + '');
    return numberStr.join('');
  }
  if (numberStr[0] === '-') {
    numberStr.splice(1, 0, insertNum + '');
    if (parseInt(numberStr.join('')) < -8000) {
      return value + '';
    }
    return numberStr.join('');
  }
  const result: string[] = [];
  let tag = true;
  numberStr.forEach(i => {
    if (tag && parseInt(i) < insertNum) {
      result.push(insertNum + '');
      result.push(i);
      tag = false;
    } else {
      result.push(i);
    }
  });
  if (tag) {
    result.push(insertNum + '');
  }
  const numberValue = result.join('');
  if (parseInt(numberValue) > 8000) {
    return value + '';
  }
  return numberValue;
};

console.log('solution2:', solution2(799));
