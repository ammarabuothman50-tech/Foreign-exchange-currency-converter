import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_CONFIG } from '../config/api-config.token';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const { baseUrl, apiKey } = inject(API_CONFIG);

  if (!req.url.startsWith(baseUrl)) return next(req);

  return next(req.clone({ setHeaders: { Authorization: `ApiKey ${apiKey}` } }));
};
