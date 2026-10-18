import { InMemoryCache } from '@apollo/client';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { API_CONFIG } from './core/config/api-config.token';
import { environment } from './core/config/environment';
import { apiKeyInterceptor } from './core/interceptors/api-key.interceptor';

const Theme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{lime.50}',
      100: '{lime.100}',
      200: '{lime.200}',
      300: '{lime.300}',
      400: '{lime.400}',
      500: '{lime.500}',
      600: '{lime.600}',
      700: '{lime.700}',
      800: '{lime.800}',
      900: '{lime.900}',
      950: '{lime.950}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([apiKeyInterceptor])),
    provideApollo(() => ({
      link: inject(HttpLink).create({ uri: environment.apiUrl }),
      cache: new InMemoryCache(),
    })),
    { provide: API_CONFIG, useValue: { baseUrl: environment.apiUrl, apiKey: environment.apiKey } },
    providePrimeNG({ theme: { preset: Theme, options: { darkModeSelector: '.app-dark' } } }),
  ],
};
