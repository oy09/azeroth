import React from 'react';
import GridContent from '@/layouts/GridContent';
import './Home.scss';

export interface HomePageProps {
  //
}

const HomePage: React.FC<HomePageProps> = props => {
  return <GridContent>Home page</GridContent>;
};

export default HomePage;
