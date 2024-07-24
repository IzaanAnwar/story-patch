'use client';

import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';

export const RegisterBtn = ({ children }: { children: any }) => (
  <RegisterLink>{children}</RegisterLink>
);
export const LoginBtn = ({ children }: { children: any }) => (
  <LoginLink>{children}</LoginLink>
);
