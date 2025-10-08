import type { ComponentType, JSX, ReactNode } from 'react';

type ProviderComponent = ({ children }: { children: ReactNode }) => ReactNode | Promise<ReactNode>;

export function withProvider<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
  providers: ProviderComponent | ProviderComponent[]
) {
  return function WrappedWithProvider(props: P): ReactNode | Promise<ReactNode> {
    const allProviders = Array.isArray(providers) ? providers : [providers];

    const wrapWithProvider = (children: ReactNode): ReactNode | Promise<ReactNode> => {
      return allProviders.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
    };

    return wrapWithProvider(<Component {...props} />);
  };
}
