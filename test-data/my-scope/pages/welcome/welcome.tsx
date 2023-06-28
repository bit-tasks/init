import React, { ReactNode } from 'react';

export type WelcomeProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function Welcome({ children }: WelcomeProps) {
  return (
    <div>
      {children}
    </div>
  );
}
