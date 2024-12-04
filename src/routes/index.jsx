import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../components/home/HomePage';
import PerformanceMap from '../components/map/PerformanceMap';
import RecentPerformances from '../components/performances/RecentPerformances';
import ArtistList from '../components/artists/ArtistList';
import StatisticsView from '../components/statistics/StatisticsView';
import UpdateForm from '../components/update/UpdateForm';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="performance-map" element={<PerformanceMap />} />
        <Route path="recent-performances" element={<RecentPerformances />} />
        <Route path="artists" element={<ArtistList />} />
        <Route path="statistics" element={<StatisticsView />} />
        <Route path="update" element={<UpdateForm />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 