import { createBrowserRouter } from 'react-router-dom';

import PageNotFound from '@features/page-not-found/PageNotFound';
import AuthGuard from '@guards/AuthGuard';
import GuestGuard from '@guards/GuestGuard';
import MainLayout from '@layouts/MainLayout';
import BookingLayout from '@layouts/BookingLayout';
import RouteErrorFallback from '@shared/components/error-boundary/RouteErrorFallback';
import { HOME_PATH } from '@shared/constants/path';
import { isFeatureEnabled } from './features.config';

const loadHomePage = async () => {
  const { default: Home } = await import('@features/home/Home');
  return { Component: Home };
};

const loadLoginPage = async () => {
  const { default: LoginPage } = await import('@features/auth/LoginPage');
  return { Component: LoginPage };
};

const loadMovieDetailsPage = async () => {
  const { default: MovieDetailsPage } = await import(
    '@features/movie-details/MovieDetailsPage'
  );
  return { Component: MovieDetailsPage };
};

const loadVipElitePage = async () => {
  const { default: VipElitePage } = await import(
    '@features/profile/vip-elite/VipElitePage'
  );
  return { Component: VipElitePage };
};

const MOVIE_DETAILS_PATHS = [
  'movie-details',
  'movie-details/:id',
  'phim/:id',
  'dat-ve/:id',
  'mua-ve/:id',
];

const VIP_ELITE_PATHS = ['profile/vip-elite', 'ho-so-vip', 'profile'];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, lazy: loadHomePage },
      { path: HOME_PATH, lazy: loadHomePage },
      {
        path: 'kham-pha',
        async lazy() {
          const { default: MovieDiscoveryPage } = await import(
            '@features/movie-discovery/MovieDiscoveryPage'
          );
          return { Component: MovieDiscoveryPage };
        },
      },
      {
        path: 'lich-chieu',
        async lazy() {
          const { default: MovieDiscoveryPage } = await import(
            '@features/movie-discovery/MovieDiscoveryPage'
          );
          return { Component: MovieDiscoveryPage };
        },
      },
      {
        path: 'rap-chieu',
        async lazy() {
          const { default: MovieDiscoveryPage } = await import(
            '@features/movie-discovery/MovieDiscoveryPage'
          );
          return { Component: MovieDiscoveryPage };
        },
      },
      {
        path: 'uu-dai',
        lazy: loadHomePage,
      },
      {
        element: <BookingLayout />,
        children: [
          ...MOVIE_DETAILS_PATHS.map((path) => ({
            path,
            lazy: loadMovieDetailsPage,
          })),
          {
            path: 'booking/seat-selection',
            async lazy() {
              const { default: SeatSelectionPage } = await import(
                '@features/booking/seat-selection/SeatSelectionPage'
              );
              return { Component: SeatSelectionPage };
            },
          },
          {
            path: 'booking/snacks-services',
            async lazy() {
              const { default: SnacksServicesPage } = await import(
                '@features/booking/snacks-services/SnacksServicesPage'
              );
              return { Component: SnacksServicesPage };
            },
          },
          {
            path: 'booking/checkout',
            async lazy() {
              const { default: CheckoutPage } = await import(
                '@features/booking/checkout/CheckoutPage'
              );
              return { Component: CheckoutPage };
            },
          },
        ],
      },
      // Protected Routes: Chỉ cho phép người dùng đã đăng nhập xem vé và hồ sơ cá nhân
      {
        element: <AuthGuard />,
        children: [
          {
            path: 've-cua-toi',
            async lazy() {
              const { default: MyTicketsPage } = await import(
                '@features/booking/my-tickets/MyTicketsPage'
              );
              return { Component: MyTicketsPage };
            },
          },
          ...VIP_ELITE_PATHS.map((path) => ({
            path,
            lazy: loadVipElitePage,
          })),
          {
            path: 'profile/personal-info',
            async lazy() {
              const { default: PersonalInfoPage } = await import(
                '@features/profile/personal-info/PersonalInfoPage'
              );
              return { Component: PersonalInfoPage };
            },
          },
          {
            path: 'profile/security',
            async lazy() {
              const { default: SecurityPage } = await import(
                '@features/profile/security/SecurityPage'
              );
              return { Component: SecurityPage };
            },
          },
          {
            path: 'profile/payment-methods',
            async lazy() {
              const { default: PaymentMethodsPage } = await import(
                '@features/profile/payment-methods/PaymentMethodsPage'
              );
              return { Component: PaymentMethodsPage };
            },
          },
          {
            path: 'profile/cinematic-taste',
            async lazy() {
              const { default: CinematicTastePage } = await import(
                '@features/profile/cinematic-taste/CinematicTastePage'
              );
              return { Component: CinematicTastePage };
            },
          },
          {
            path: 'profile/notification-settings',
            async lazy() {
              const { default: NotificationSettingsPage } = await import(
                '@features/profile/notification-settings/NotificationSettingsPage'
              );
              return { Component: NotificationSettingsPage };
            },
          },
          {
            path: 'profile/passport',
            async lazy() {
              if (!isFeatureEnabled('passport')) {
                return { Component: PageNotFound };
              }
              const { default: PassportPage } = await import(
                '@features/passport/PassportPage'
              );
              return { Component: PassportPage };
            },
          },
          {
            path: 'ho-chieu',
            async lazy() {
              if (!isFeatureEnabled('passport')) {
                return { Component: PageNotFound };
              }
              const { default: PassportPage } = await import(
                '@features/passport/PassportPage'
              );
              return { Component: PassportPage };
            },
          },
        ],
      },
      { path: '*', element: <PageNotFound /> },
    ],
  },
  {
    element: <GuestGuard />,
    children: [{ path: '/login', lazy: loadLoginPage }],
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);
