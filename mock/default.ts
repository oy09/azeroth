import { Random, mock } from 'mockjs';

Random.extend({
  phone: () => {
    const prefix = [134, 135, 155, 189];
    return Random.pick(prefix) + mock(/\d{8}/);
  },
});
