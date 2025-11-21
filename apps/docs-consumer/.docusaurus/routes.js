import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/sandbox',
    component: ComponentCreator('/sandbox', '544'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '6f6'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '81f'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '048'),
            routes: [
              {
                path: '/',
                component: ComponentCreator('/', '36e'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
