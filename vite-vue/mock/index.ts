// test.ts

import { MockMethod } from 'vite-plugin-mock';
export default [
  {
    url: '/user/menu',
    method: 'get',
    response: ({ query }) => {
      console.log("=== query: ", query);
      
      return {
        code: 0,
        data: {
          name: '这是mock',
        },
      };
    },
  },
] as MockMethod[];
